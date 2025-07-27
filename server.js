const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const app = express();

// Optional environment var for easier CORS updates
const allowedOrigins = [
  process.env.BASE_FRONTEND_URL || "https://amberandstephen.info",
  "http://localhost:3000",
  "https://wedding-r3hc.onrender.com",
];

// CORS config
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const msg = `The CORS policy does not allow access from origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  methods: ["POST", "GET"], // Added GET for OAuth callback
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// OAuth2 setup for Gmail
const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI // Should be: http://localhost:3001/auth/callback for development
);

// Set credentials if we have a refresh token
if (process.env.GMAIL_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    access_token: process.env.GMAIL_ACCESS_TOKEN, // Optional, will be auto-refreshed
  });
}

// Service Account setup for Google Sheets (keep this separate)
const sheetsAuth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth: sheetsAuth });
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

const SPREADSHEET_ID = "1sKZcfKe_JgcEqQzXGN1n7CVaTrPVJ1PcR-asZ0Mo02A";
const RANGE = "RSVPs!A:J";

// Test Gmail auth
async function testGmailAuth() {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    console.log("✅ Gmail OAuth2 Auth Succeeded");
  } catch (err) {
    console.error("❌ Gmail OAuth2 Auth Failed:", err.message);
    console.log("🔗 You may need to authorize the app first. Visit /auth/url");
  }
}

testGmailAuth();

// OAuth2 authorization URL endpoint
app.get("/auth/url", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.compose",
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline", // Important: gets refresh token
    scope: scopes,
    prompt: "consent", // Forces consent screen to get refresh token
  });

  console.log("🔗 Visit this URL to authorize the app:", authUrl);
  res.json({ authUrl });
});

// OAuth2 callback endpoint
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).send("Authorization code not provided");
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log("✅ OAuth2 tokens received:");
    console.log("Access Token:", tokens.access_token ? "✓" : "✗");
    console.log("Refresh Token:", tokens.refresh_token ? "✓" : "✗");

    // Save these tokens to your environment variables
    console.log("\n🔧 Add these to your environment variables:");
    console.log(`GMAIL_ACCESS_TOKEN=${tokens.access_token}`);
    if (tokens.refresh_token) {
      console.log(`GMAIL_REFRESH_TOKEN=${tokens.refresh_token}`);
    }

    res.send(`
      <h2>Authorization Successful!</h2>
      <p>Check your server console for the tokens to add to your environment variables.</p>
      <p>You can now send emails through the API.</p>
    `);
  } catch (error) {
    console.error("❌ Error getting OAuth2 tokens:", error);
    res.status(500).send("Error during authorization");
  }
});

// Format RSVP data into email text
function formatRSVPForEmail(rsvpData) {
  if (!rsvpData || !Array.isArray(rsvpData.parties)) {
    return "Invalid RSVP data format.";
  }

  let allGuests = [];
  let firstGuestName = "";

  rsvpData.parties.forEach((party) => {
    party.guests.forEach((guest) => {
      if (!firstGuestName) firstGuestName = guest.name.split(" ")[0];
      allGuests.push({
        ...guest,
        partyName: party.partyName,
        mealPrefs: (party.mealPreferences || {})[guest.name] || {},
      });
    });
  });

  const guestSections = allGuests.map((guest) => {
    const { mealPrefs } = guest;

    const dietary = [];
    if (mealPrefs.vegan) dietary.push("Vegan");
    if (mealPrefs.vegetarian) dietary.push("Vegetarian");
    if (mealPrefs.glutenFree) dietary.push("Gluten Free");
    if (mealPrefs.dairyFree) dietary.push("Dairy Free");
    if (mealPrefs.nutFree) dietary.push("Nut Free");

    return `
      <div style="margin-top: 30px;">
        <p style="font-size: 16px; color: #444;"><strong>${
          guest.name
        }</strong></p>
        <ul style="list-style: none; padding: 0; font-size: 15px; color: #555;">
          <li>• Welcome Party: <strong>${
            guest.welcomeParty ? "Yes" : "No"
          }</strong></li>
          <li>• Wedding Day: <strong>${
            guest.weddingDay ? "Yes" : "No"
          }</strong></li>
          <li>• Entree: <strong>${
            mealPrefs.entree || "Not specified"
          }</strong></li>
          <li>• Cake: <strong>${mealPrefs.cake || "Not specified"}</strong></li>
          ${
            dietary.length > 0
              ? `<li>• Dietary: <strong>${dietary.join(", ")}</strong></li>`
              : ""
          }
          ${
            mealPrefs.dietaryRestrictions
              ? `<li>• Restrictions: <strong>${mealPrefs.dietaryRestrictions}</strong></li>`
              : ""
          }
          ${
            mealPrefs.allergies
              ? `<li>• Allergies: <strong>${mealPrefs.allergies}</strong></li>`
              : ""
          }
        </ul>
      </div>
    `;
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>RSVP Confirmation</title>
</head>
<body style="margin: 0; padding: 40px 20px; font-family: Georgia, serif; background-color: #f4f4f4; color: #333;">
  <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; padding: 40px 30px; box-shadow: 0 2px 12px rgba(0,0,0,0.05);">

    <div style="text-align: center; margin-bottom: 30px;">
      <div style="font-size: 40px; color: #28a745;">✔</div>
      <h1 style="margin: 10px 0 0 0; font-size: 28px; color: #333;">R.S.V.P Confirmed</h1>
    </div>

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 16px; color: #555;">Dear <strong>${firstGuestName}</strong>,</p>

    <p style="font-size: 16px; color: #555;">
      Thank you for your RSVP! Below are your confirmation details for Amber & Stephen's wedding.
    </p>

    ${guestSections.join("")}

    <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">

    <p style="font-size: 16px; text-align: center; color: #555;">
      With love,<br>
      <strong>Amber & Stephen</strong>
    </p>

    <p style="text-align: center; font-size: 12px; color: #aaa; margin-top: 40px;">
      This is an automated confirmation email. If you need to make changes to your RSVP, please contact us directly.
    </p>
  </div>
</body>
</html>`;
}

// Create a properly formatted Gmail message
function createEmailMessage(to, from, subject, textContent) {
  const email = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=UTF-8`,
    `MIME-Version: 1.0`,
    "",
    textContent,
  ].join("\r\n");

  return Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

// RSVP submission endpoint (unchanged)
app.post("/api/submit-rsvp", async (req, res) => {
  try {
    const rsvpData = req.body;
    const rows = [];
    const timestamp = new Date().toISOString();

    rsvpData.parties.forEach((party) => {
      party.guests.forEach((guest) => {
        rows.push([
          timestamp,
          party.partyName,
          guest.name,
          guest.welcomeParty ? "Yes" : "No",
          guest.weddingDay ? "Yes" : "No",
          guest.entree || "",
          guest.cake || "",
          guest.dietaryRestrictions || "",
          guest.allergies || "",
        ]);
      });
    });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: "RAW",
      requestBody: { values: rows },
    });

    console.log("✅ RSVP submitted to Google Sheets:", response.data);
    res.json({ success: true, message: "RSVP submitted successfully!" });
  } catch (error) {
    console.error("❌ Error submitting RSVP:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting RSVP. Please try again later.",
    });
  }
});

// Email confirmation endpoint (updated for OAuth2)
app.post("/api/send-rsvp-email", async (req, res) => {
  try {
    const { to, rsvpData } = req.body;

    if (!to) {
      return res
        .status(400)
        .json({ success: false, message: "Email address is required" });
    }
    if (!rsvpData) {
      return res
        .status(400)
        .json({ success: false, message: "RSVP data is required" });
    }

    // Check if we have valid credentials
    const credentials = oauth2Client.credentials;
    if (!credentials || !credentials.access_token) {
      return res.status(401).json({
        success: false,
        message: "Gmail authentication required. Please contact administrator.",
      });
    }

    const emailContent = formatRSVPForEmail(rsvpData);
    const subject = "RSVP Confirmation - Amber & Stephen's Wedding";
    const fromEmail = process.env.GMAIL_FROM_EMAIL || "your-email@gmail.com"; // Set this to your Gmail

    const raw = createEmailMessage(to, fromEmail, subject, emailContent);

    const response = await gmail.users.messages.send({
      userId: "me",
      requestBody: { raw },
    });

    console.log("✅ Email sent:", response.data);
    res.json({
      success: true,
      message: "Confirmation email sent successfully!",
      messageId: response.data.id,
    });
  } catch (error) {
    console.error("❌ Error sending email:", error);

    if (error.code === 401) {
      res.status(401).json({
        success: false,
        message: "Gmail authentication expired. Please contact administrator.",
      });
    } else if (error.code === 403) {
      res.status(403).json({
        success: false,
        message: "Gmail API access denied. Check permissions.",
      });
    } else if (error.code === 400) {
      res.status(400).json({
        success: false,
        message: "Invalid email format or data.",
      });
    } else {
      res.status(500).json({
        success: false,
        message: "Error sending confirmation email. Please try again later.",
      });
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ RSVP server running on port ${PORT}`);
  console.log(`🔗 Authorization URL: http://localhost:${PORT}/auth/url`);
});

module.exports = app;
