// server.js or index.js
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const path = require("path");

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

app.use(express.json());

// Parse and debug your service account key before using it
const creds = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);

console.log("Service account email:", creds.client_email);
console.log("private_key first 100 chars:", creds.private_key.slice(0, 100));
console.log("Current server time:", new Date().toISOString());

// Now create Google Auth with parsed creds
const auth = new google.auth.GoogleAuth({
  credentials: creds,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1sKZcfKe_JgcEqQzXGN1n7CVaTrPVJ1PcR-asZ0Mo02A";
const RANGE = "RSVPs!A:J";

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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ RSVP server running on port ${PORT}`);
});

module.exports = app;
