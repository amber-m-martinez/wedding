// server.js or index.js
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

const app = express();

// CORS setup: allow your frontend domains
const allowedOrigins = [
  "https://amberandstephen.info",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("/api/submit-rsvp", cors(corsOptions)); // enable preflight for this route
app.options("/api/send-rsvp-email", cors(corsOptions)); // enable preflight for email route
app.options("/api/send-rsvp-email", cors(corsOptions)); // enable preflight for email route

app.use(express.json());

// Parse and debug your service account key before using it
const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

console.log("Service account email:", creds.client_email);
console.log("private_key first 100 chars:", creds.private_key.slice(0, 100));
console.log("Current server time:", new Date().toISOString());

// Create Google Auth with both Sheets and Gmail scopes
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/gmail.send",
  ],
});

async function testAuth() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY),
      scopes: [
        "https://www.googleapis.com/auth/spreadsheets",
        "https://www.googleapis.com/auth/gmail.send",
      ],
    });

    const client = await auth.getClient();
    const token = await client.getAccessToken();
    console.log("Access token:", token.token);
    console.log("Authentication succeeded!");
  } catch (err) {
    console.error("Authentication error:", err);
  }
}

testAuth();

const sheets = google.sheets({ version: "v4", auth });
const gmail = google.gmail({ version: "v1", auth });

const SPREADSHEET_ID = "1sKZcfKe_JgcEqQzXGN1n7CVaTrPVJ1PcR-asZ0Mo02A";
const RANGE = "RSVPs!A:J";

// Helper function to format RSVP data for email
function formatRSVPForEmail(rsvpData) {
  let emailContent = `Dear Guest,\n\n`;
  emailContent += `Thank you for your RSVP! Here are your confirmation details:\n\n`;

  let totalWeddingDay = 0;
  let totalWelcomeParty = 0;
  let firstGuestName = "";

  // Calculate totals and get first guest name
  Object.entries(rsvpData).forEach(([partyName, party]) => {
    if (party.guests) {
      Object.values(party.guests).forEach((guest) => {
        if (!firstGuestName) firstGuestName = guest.name.split(" ")[0];
        if (guest.weddingDay) totalWeddingDay++;
        if (guest.welcomeParty) totalWelcomeParty++;
      });
    }
  });

  // Update greeting with first guest name
  emailContent = emailContent.replace("Dear Guest", `Dear ${firstGuestName}`);

  emailContent += `EVENT ATTENDANCE:\n`;
  emailContent += `• Wedding Day: ${totalWeddingDay} guest(s)\n`;
  emailContent += `• Welcome Party: ${totalWelcomeParty} guest(s)\n\n`;

  emailContent += `GUEST DETAILS:\n`;
  Object.entries(rsvpData).forEach(([partyName, party]) => {
    if (party.guests) {
      emailContent += `${partyName}:\n`;
      Object.values(party.guests).forEach((guest, index) => {
        emailContent += `  ${index + 1}. ${guest.name}\n`;
        emailContent += `     • Welcome Party: ${
          guest.welcomeParty ? "Yes" : "No"
        }\n`;
        emailContent += `     • Wedding Day: ${
          guest.weddingDay ? "Yes" : "No"
        }\n`;
        emailContent += `\n`;
      });

      // Add meal preferences for this party
      if (
        party.mealPreferences &&
        Object.keys(party.mealPreferences).length > 0
      ) {
        emailContent += `  Meal Preferences:\n`;
        Object.entries(party.mealPreferences).forEach(([guestName, prefs]) => {
          emailContent += `    ${guestName}:\n`;
          emailContent += `      • Entree: ${
            prefs.entree || "Not specified"
          }\n`;
          emailContent += `      • Cake: ${prefs.cake || "Not specified"}\n`;
          if (prefs.dietaryRestrictions)
            emailContent += `      • Dietary Restrictions: ${prefs.dietaryRestrictions}\n`;
          if (prefs.allergies)
            emailContent += `      • Allergies: ${prefs.allergies}\n`;
          emailContent += `\n`;
        });
      }
      emailContent += `\n`;
    }
  });

  emailContent += `We're so excited to celebrate with you!\n\n`;
  emailContent += `With love,\nAmber & Stephen\n\n`;
  emailContent += `---\nThis is an automated confirmation email. If you need to make changes to your RSVP, please contact us directly.`;

  return emailContent;
}

// Helper function to create email message
function createEmailMessage(to, subject, textContent) {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    `Content-Type: text/plain; charset=UTF-8`,
    "",
    textContent,
  ].join("\n");

  // Encode the email in base64url format
  const encodedEmail = Buffer.from(email)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return encodedEmail;
}

// RSVP POST endpoint
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

    console.log("RSVP data submitted:", response.data);
    res.json({ success: true, message: "RSVP submitted successfully!" });
  } catch (error) {
    console.error("Error submitting RSVP:", error);
    res.status(500).json({
      success: false,
      message: "Error submitting RSVP. Please try again later.",
    });
  }
});

// Email confirmation endpoint
app.post("/api/send-rsvp-email", async (req, res) => {
  try {
    const { to, rsvpData } = req.body;

    if (!to) {
      return res.status(400).json({
        success: false,
        message: "Email address is required",
      });
    }

    if (!rsvpData) {
      return res.status(400).json({
        success: false,
        message: "RSVP data is required",
      });
    }

    // Format the email content
    const emailContent = formatRSVPForEmail(rsvpData);
    const subject = "RSVP Confirmation - Amber & Stephen's Wedding";

    // Create the email message
    const encodedMessage = createEmailMessage(to, subject, emailContent);

    // Send the email
    const response = await gmail.users.messages.send({
      userId: "me", // This will use the service account email
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Email sent successfully:", response.data);
    res.json({
      success: true,
      message: "Confirmation email sent successfully!",
      messageId: response.data.id,
    });
  } catch (error) {
    console.error("Error sending email:", error);

    // More specific error handling
    if (error.code === 403) {
      res.status(403).json({
        success: false,
        message:
          "Gmail API access denied. Please check your service account permissions.",
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
});

module.exports = app;
