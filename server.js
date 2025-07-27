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

// Format RSVP data into HTML email
function formatRSVPForEmail(rsvpData) {
  if (!rsvpData || !Array.isArray(rsvpData.parties)) {
    return "Invalid RSVP data format.";
  }

  let firstGuestName = "";
  let hasAnyAttendance = false;
  let allGuests = [];

  // Collect all guests and check attendance
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

  let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>RSVP Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: Georgia, serif; background-color: #f8f8f8;">
    <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 40px 30px;">
        <!-- Header with Logo -->
        <div style="text-align: center; margin-bottom: 30px;">
            <img src="${logoUrl}" alt="Amber & Stephen" style="max-width: 150px; height: auto;" />
        </div>
        
        <!-- Greeting -->
        <div style="margin-bottom: 30px;">
            <p style="font-size: 18px; color: #333; margin: 0;">Dear ${firstGuestName},</p>
        </div>
        
        <!-- Thank you message -->
        <div style="margin-bottom: 30px;">
            <p style="font-size: 16px; color: #666; line-height: 1.6; margin: 0;">
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
        <!-- Guest Details -->
        <div style="margin-bottom: 30px;">
            <h3 style="font-size: 18px; color: #333; margin: 0 0 20px 0; font-weight: bold;">Guest Details</h3>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
`;

    allGuests.forEach((guest, index) => {
      if (guest.weddingDay || guest.welcomeParty) {
        htmlContent += `
                <div style="margin-bottom: ${
                  index === allGuests.length - 1 ? "0" : "15px"
                }; padding-bottom: ${
          index === allGuests.length - 1 ? "0" : "15px"
        }; ${
          index !== allGuests.length - 1
            ? "border-bottom: 1px solid #e0e0e0;"
            : ""
        }">
                    <p style="font-size: 16px; color: #333; margin: 0 0 8px 0; font-weight: 500;">${
                      guest.name
                    }</p>
                    <p style="font-size: 14px; color: #666; margin: 0 0 4px 0;">• Welcome Party: ${
                      guest.welcomeParty ? "Yes" : "No"
                    }</p>
                    <p style="font-size: 14px; color: #666; margin: 0;">• Wedding Day: ${
                      guest.weddingDay ? "Yes" : "No"
                    }</p>
                </div>
`;
      }
    });

    htmlContent += `
            </div>
        </div>
`;

    // Add meal preferences section
    let hasMealPrefs = false;
    let mealPrefsContent = "";

    rsvpData.parties.forEach((party) => {
      if (
        party.mealPreferences &&
        Object.keys(party.mealPreferences).length > 0
      ) {
        hasMealPrefs = true;
        Object.entries(party.mealPreferences).forEach(([guestName, prefs]) => {
          // Check if this guest is actually attending
          const attendingGuest = allGuests.find(
            (g) => g.name === guestName && (g.weddingDay || g.welcomeParty)
          );
          if (attendingGuest) {
            mealPrefsContent += `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e0e0e0;">
                    <p style="font-size: 16px; color: #333; margin: 0 0 8px 0; font-weight: 500;">${guestName}</p>
                    <p style="font-size: 14px; color: #666; margin: 0 0 4px 0;">• Entree: ${
                      prefs.entree || "Not specified"
                    }</p>
                    <p style="font-size: 14px; color: #666; margin: 0 0 4px 0;">• Cake: ${
                      prefs.cake || "Not specified"
                    }</p>
`;

            // Add dietary preferences
            const dietaryItems = [];
            if (prefs.vegan) dietaryItems.push("Vegan");
            if (prefs.vegetarian) dietaryItems.push("Vegetarian");
            if (prefs.glutenFree) dietaryItems.push("Gluten Free");
            if (prefs.dairyFree) dietaryItems.push("Dairy Free");
            if (prefs.nutFree) dietaryItems.push("Nut Free");

            if (dietaryItems.length > 0) {
              mealPrefsContent += `<p style="font-size: 14px; color: #666; margin: 0 0 4px 0;">• Dietary Preferences: ${dietaryItems.join(
                ", "
              )}</p>`;
            }

            if (prefs.dietaryRestrictions) {
              mealPrefsContent += `<p style="font-size: 14px; color: #666; margin: 0 0 4px 0;">• Dietary Restrictions: ${prefs.dietaryRestrictions}</p>`;
            }
            if (prefs.allergies) {
              mealPrefsContent += `<p style="font-size: 14px; color: #666; margin: 0;">• Allergies: ${prefs.allergies}</p>`;
            }

            mealPrefsContent += `</div>`;
          }
        });
      }
    });

    if (hasMealPrefs && mealPrefsContent) {
      // Remove the last border-bottom
      mealPrefsContent = mealPrefsContent.replace(
        /border-bottom: 1px solid #e0e0e0;">([^<]*)$/,
        '">$1'
      );

      htmlContent += `
        <!-- Meal Preferences -->
        <div style="margin-bottom: 30px;">
            <h3 style="font-size: 18px; color: #333; margin: 0 0 20px 0; font-weight: bold;">Meal Preferences</h3>
            
            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px;">
                ${mealPrefsContent}
            </div>
        </div>
`;
    }
  }

  htmlContent += `
        <!-- Closing Message -->
        <div style="margin-bottom: 30px; text-align: center;">
            <p style="font-size: 16px; color: #666; line-height: 1.6; margin: 0;">
                Thank you for letting us know!
            </p>
        </div>
        
        <!-- Signature -->
        <div style="text-align: center; margin-bottom: 30px;">
            <p style="font-size: 16px; color: #333; margin: 0;">With love,</p>
            <p style="font-size: 18px; color: #333; margin: 5px 0 0 0; font-weight: 500;">Amber & Stephen</p>
        </div>
        
        <!-- Footer -->
        <div style="text-align: center; border-top: 1px solid #e0e0e0; padding-top: 20px;">
            <p style="font-size: 12px; color: #999; margin: 0;">
                This is an automated confirmation email. If you need to make changes to your RSVP, please contact us directly.
            </p>
        </div>
    </div>
</body>
</html>`;

  return htmlContent;
}

// Create a properly formatted Gmail message with HTML
function createEmailMessage(to, from, subject, htmlContent) {
  const email = [
    `To: ${to}`,
    `From: ${from}`,
    `Subject: ${subject}`,
    `Content-Type: text/html; charset=UTF-8`,
    `MIME-Version: 1.0`,
    "",
    htmlContent,
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

// Email confirmation endpoint (updated for HTML email)
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

    const htmlContent = formatRSVPForEmail(rsvpData);
    const subject = "RSVP Confirmation - Amber & Stephen's Wedding";
    const fromEmail = process.env.GMAIL_FROM_EMAIL || "your-email@gmail.com"; // Set this to your Gmail

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
