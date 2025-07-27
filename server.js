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

  let emailContent = `Dear Guest,\n\n`;
  emailContent += `Thank you for your RSVP! Here are your confirmation details:\n\n`;

  let totalWeddingDay = 0;
  let totalWelcomeParty = 0;
  let firstGuestName = "";

  rsvpData.parties.forEach((party) => {
    if (party.guests) {
      party.guests.forEach((guest) => {
        if (!firstGuestName) firstGuestName = guest.name.split(" ")[0];
        if (guest.weddingDay) totalWeddingDay++;
        if (guest.welcomeParty) totalWelcomeParty++;
      });
    }
  });

  emailContent = emailContent.replace("Dear Guest", `Dear ${firstGuestName}`);
  emailContent += `EVENT ATTENDANCE:\n`;
  emailContent += `• Wedding Day: ${totalWeddingDay} guest(s)\n`;
  emailContent += `• Welcome Party: ${totalWelcomeParty} guest(s)\n\n`;

  emailContent += `GUEST DETAILS:\n`;

  rsvpData.parties.forEach((party) => {
    const partyName = party.partyName;
    emailContent += `${partyName}:\n`;

    if (party.guests) {
      party.guests.forEach((guest, index) => {
        emailContent += `  ${index + 1}. ${guest.name}\n`;
        emailContent += `     • Welcome Party: ${
          guest.welcomeParty ? "Yes" : "No"
        }\n`;
        emailContent += `     • Wedding Day: ${
          guest.weddingDay ? "Yes" : "No"
        }\n\n`;
      });
    }

    if (
      party.mealPreferences &&
      Object.keys(party.mealPreferences).length > 0
    ) {
      emailContent += `  Meal Preferences:\n`;
      Object.entries(party.mealPreferences).forEach(([guestName, prefs]) => {
        emailContent += `    ${guestName}:\n`;
        emailContent += `      • Entree: ${prefs.entree || "Not specified"}\n`;
        emailContent += `      • Cake: ${prefs.cake || "Not specified"}\n`;
        if (prefs.dietaryRestrictions)
          emailContent += `      • Dietary Restrictions: ${prefs.dietaryRestrictions}\n`;
        if (prefs.allergies)
          emailContent += `      • Allergies: ${prefs.allergies}\n`;
        emailContent += `\n`;
      });
    }

    emailContent += `\n`;
  });

  emailContent += `We're so excited to celebrate with you!\n\nWith love,\nAmber & Stephen\n\n`;
  emailContent += `---\nThis is an automated confirmation email. If you need to make changes to your RSVP, please contact us directly.`;

  return emailContent;
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
