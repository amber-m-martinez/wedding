const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const app = express();

const allowedOrigins = [
  process.env.BASE_FRONTEND_URL || "https://amberandstephen.info",
  "http://localhost:3000",
  "https://wedding-r3hc.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(
      new Error(`The CORS policy does not allow access from origin: ${origin}`),
      false
    );
  },
  methods: ["POST", "GET"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

const oauth2Client = new google.auth.OAuth2(
  process.env.GMAIL_CLIENT_ID,
  process.env.GMAIL_CLIENT_SECRET,
  process.env.GMAIL_REDIRECT_URI
);

if (process.env.GMAIL_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.GMAIL_REFRESH_TOKEN,
    access_token: process.env.GMAIL_ACCESS_TOKEN,
  });
}

const sheetsAuth = new google.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth: sheetsAuth });
const gmail = google.gmail({ version: "v1", auth: oauth2Client });

const SPREADSHEET_ID = "1sKZcfKe_JgcEqQzXGN1n7CVaTrPVJ1PcR-asZ0Mo02A";
const RANGE = "RSVPs!A:J";

async function testGmailAuth() {
  try {
    await oauth2Client.getAccessToken();
    console.log("✅ Gmail OAuth2 Auth Succeeded");
  } catch (err) {
    console.error("❌ Gmail OAuth2 Auth Failed:", err.message);
    console.log("🔗 You may need to authorize the app first. Visit /auth/url");
  }
}

testGmailAuth();

app.get("/auth/url", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/gmail.send",
    "https://www.googleapis.com/auth/gmail.compose",
  ];

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  console.log("🔗 Visit this URL to authorize the app:", authUrl);
  res.json({ authUrl });
});

app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send("Authorization code not provided");

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    console.log("✅ OAuth2 tokens received:");
    console.log("Access Token:", tokens.access_token ? "✓" : "✗");
    console.log("Refresh Token:", tokens.refresh_token ? "✓" : "✗");

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

function formatRSVPForEmail(rsvpData) {
  if (!rsvpData || !Array.isArray(rsvpData.parties)) {
    return "Invalid RSVP data format.";
  }

  let firstGuestName = "";
  let hasAnyAttendance = false;
  let allGuests = [];

  rsvpData.parties.forEach((party) => {
    if (party.guests) {
      party.guests.forEach((guest) => {
        if (!firstGuestName) firstGuestName = guest.name.split(" ")[0];
        if (guest.weddingDay || guest.welcomeParty) hasAnyAttendance = true;
        allGuests.push({
          ...guest,
          partyName: party.partyName,
        });
      });
    }
  });

  const baseUrl =
    process.env.BASE_FRONTEND_URL || "https://amberandstephen.info";
  const logoUrl = `${baseUrl}/images/swan-monogram-thin-grey.png`;
  const attireLink = `${baseUrl}/attire`;

  let htmlContent = `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>RSVP Confirmation</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Infant:ital,wght@0,400;0,700;1,400&display=swap');
  body, p, h3 {
    font-family: 'Cormorant Infant', Georgia, serif;
  }
</style>
</head>
<body style="margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 30px;">
    <div style="text-align: center; margin-bottom: 30px;">
      <img src="${logoUrl}" alt="Amber & Stephen" style="max-width: 150px; height: auto;" />
    </div>
    <div style="margin-bottom: 30px;">
      <p style="font-size: 18px; color: #333;">Dear ${firstGuestName},</p>
    </div>
    <div style="margin-bottom: 25px;">
      <p style="font-size: 16px; color: #666; line-height: 1.6;">
        ${
          hasAnyAttendance
            ? "Thank you for your RSVP! Here are your confirmation details:"
            : "Thank you for letting us know you won't be able to join us. We'll miss celebrating with you!"
        }
      </p>
    </div>
`;

  if (hasAnyAttendance) {
    htmlContent += `
      <div style="margin-bottom: 30px;">
        <h3 style="font-size: 18px; color: #333; margin: 0 0 20px; font-weight: bold;">Guest Summary</h3>
        ${allGuests
          .filter((guest) => guest.welcomeParty || guest.weddingDay)
          .map((guest) => {
            const prefs =
              rsvpData.parties.find((p) => p.partyName === guest.partyName)
                ?.mealPreferences?.[guest.name] || {};

            const entreeLabel = prefs.entree || "Not specified";
            const cakeLabel = prefs.cake || "Not specified";

            const dietaryTags = [];
            if (prefs.vegan) dietaryTags.push("Vegan");
            if (prefs.vegetarian) dietaryTags.push("Vegetarian");
            if (prefs.glutenFree) dietaryTags.push("Gluten Free");
            if (prefs.dairyFree) dietaryTags.push("Dairy Free");
            if (prefs.nutFree) dietaryTags.push("Nut Free");

            return `
            <div style="margin-bottom: 20px; padding: 20px; border: 1px solid #e0e0e0; border-radius: 6px; background-color: #f9f9f9;">
              <p style="margin: 0 0 6px; font-size: 16px; font-weight: 600;">${
                guest.name
              }</p>
              <p style="margin: 4px 0; font-size: 15px;">Events: ${
                !guest.welcomeParty && !guest.weddingDay
                  ? "Not Attending"
                  : `${guest.welcomeParty ? "Welcome Party" : ""}${
                      guest.welcomeParty && guest.weddingDay ? ", " : ""
                    }${guest.weddingDay ? "Wedding Day" : ""}`
              }</p>
              <p style="margin: 4px 0; font-size: 15px;">Entree: ${entreeLabel}
                ${
                  entreeLabel !== "Not specified"
                    ? `<span style="font-style: italic; font-size: 13px; color: #777; margin-left: 6px;">${getMealDescription(
                        entreeLabel,
                        "entree"
                      )}</span>`
                    : ""
                }
              </p>
              <p style="margin: 4px 0; font-size: 15px;">Cake: ${cakeLabel}
                ${
                  cakeLabel !== "Not specified"
                    ? `<span style="font-style: italic; font-size: 13px; color: #777; margin-left: 6px;">${getMealDescription(
                        cakeLabel,
                        "cake"
                      )}</span>`
                    : ""
                }
              </p>
              ${
                prefs.dietaryRestrictions
                  ? `<p style="margin: 4px 0; font-size: 15px;">Dietary Restrictions: ${prefs.dietaryRestrictions}</p>`
                  : ""
              }
              ${
                prefs.allergies
                  ? `<p style="margin: 4px 0; font-size: 15px;">Allergies: ${prefs.allergies}</p>`
                  : ""
              }
              ${
                dietaryTags.length > 0
                  ? `<p style="margin: 4px 0; font-size: 15px;">Dietary Preferences: ${dietaryTags.join(
                      ", "
                    )}</p>`
                  : ""
              }
            </div>
          `;
          })
          .join("")}
      </div>
    `;

    // Show Welcome Party first if attending both
    const attendingWelcome = allGuests.some((g) => g.welcomeParty);
    const attendingWedding = allGuests.some((g) => g.weddingDay);

    if (attendingWelcome) {
      htmlContent += `
      <div style="margin: 40px 0;">
        <h3 style="font-size: 20px; margin-bottom: 10px; color: #333;">Welcome Party</h3>
        <p style="margin: 4px 0; font-size: 16px">Thursday, October 23rd, 2025</p>
        <p style="margin: 4px 0; font-size: 16px">Clover Club – <a href="https://maps.app.goo.gl/swFgyYSkyL5UdSKWA" style="color: #555;">210 Smith St, Brooklyn, NY 11201</a></p>
        <p style="margin: 4px 0; font-size: 16px">5–7pm | Attire: <a href="${attireLink}" style="color: #555;">Elevated Smart Casual</a></p>
        <p style="margin: 4px 0; font-size: 16px">Join us for drinks and mingling in a cozy, cocktail-style setting.</p>
      </div>`;
    }

    if (attendingWedding) {
      htmlContent += `
      <div style="margin: 40px 0;">
        <h3 style="font-size: 20px; margin-bottom: 10px; color: #333;">Wedding Day</h3>
        <p style="margin: 4px 0; font-size: 16px">Friday, October 24th, 2025</p>
        <p style="margin: 4px 0; font-size: 16px">Prospect Park Boathouse – <a href="https://maps.app.goo.gl/iGexChb4n3WyuamP7" style="color: #555;">101 East Dr, Brooklyn, NY 11225</a></p>
        <p style="margin: 4px 0; font-size: 16px">5:00pm Arrival | Attire: <a href="${attireLink}" style="color: #555;">Black-Tie Optional</a></p>
        <p style="margin: 4px 0; font-size: 16px">5:30pm Ceremony by the Lullwater (outdoors)</p>
        <p style="margin: 4px 0; font-size: 16px">6:00pm Cocktails & hors d'oeuvres on the terrace</p>
        <p style="margin: 4px 0; font-size: 16px">7:00pm Dinner inside the Boathouse</p>
        <img src="${baseUrl}/images/boathouse-event-map.png" alt="Boathouse Directions" style="width: 100%; border-radius: 8px; margin-top: 19px;" />
        <p style="margin-top: 19px; text-align: center; font-size: 16px; color: #777;">Note: The Boathouse is not accessible by car. Use the designated drop‑off point and follow pedestrian-only paths. Staff will guide you. Parking is available along Willink Drive if needed.</p>
      </div>`;
    }
  }

  htmlContent += `
    <div style="text-align: center; margin-bottom: 30px;">
      <p style="font-size: 17px; color: #333;">With love,</p>
      <p style="font-size: 18px; color: #333; font-weight: 500;">Amber & Stephen ♡</p>
    </div>
    <div style="text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px;">
      <p style="font-size: 12px; color: #999;">
        This is an automated confirmation email. If you need to make changes to your RSVP, please contact us directly.
      </p>
    </div>
  </div>
</body>
</html>`;

  return htmlContent;

  function getMealDescription(name, type) {
    const entreeDescriptions = {
      "Grilled Hanger Steak": "GF, dairy",
      "Roasted Chicken Breast": "GF, dairy",
    };

    const cakeDescriptions = {
      "Lemon Blueberry": "Gluten, dairy",
      "Strawberry Shortcake": "Gluten, dairy",
      "Bananas Foster": "Gluten, dairy",
      "Olive Oil Pistachio & Fig": "Gluten, dairy, nuts",
      "Vanilla & Raspberry Jam": "GF, vegan",
    };

    if (type === "entree") return entreeDescriptions[name] || "";
    if (type === "cake") return cakeDescriptions[name] || "";
    return "";
  }
}

function createEmailMessage(to, from, subject, htmlContent) {
  const messageParts = [
    `From: ${from}`,
    `To: ${to}`,
    `Subject: ${subject}`,
    `MIME-Version: 1.0`,
    `Content-Type: text/html; charset=UTF-8`,
    "",
    htmlContent,
  ];

  const message = messageParts.join("\r\n");

  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

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

app.post("/api/send-rsvp-email", async (req, res) => {
  try {
    const { to, rsvpData } = req.body;

    if (!to || !rsvpData) {
      return res.status(400).json({
        success: false,
        message: "Missing email address or RSVP data.",
      });
    }

    const credentials = oauth2Client.credentials;
    if (!credentials || !credentials.access_token) {
      return res
        .status(401)
        .json({ success: false, message: "Gmail authentication required." });
    }

    const htmlContent = formatRSVPForEmail(rsvpData);
    const subject = "RSVP Confirmation - Amber & Stephen's Wedding";
    const fromEmail = process.env.GMAIL_FROM_EMAIL || "your-email@gmail.com";

    const raw = createEmailMessage(to, fromEmail, subject, htmlContent);

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
    res.status(error.code || 500).json({
      success: false,
      message: error.message || "Email failed to send.",
    });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ RSVP server running on port ${PORT}`);
  console.log(`🔗 Authorization URL: http://localhost:${PORT}/auth/url`);
});

module.exports = app;
