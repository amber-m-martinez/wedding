const functions = require("firebase-functions");
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");

// Create Express app
const app = express();

// CORS setup: allow your frontend domains
const allowedOrigins = [
  "https://amberandstephen.info",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow requests with no origin (like curl, mobile apps)
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy doesn't allow access from Origin: ${origin}`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["POST"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("/api/submit-rsvp", cors(corsOptions)); // preflight OPTIONS request handler
app.use(express.json());

// Google Sheets Auth without local key file, uses Firebase default credentials
const auth = new google.auth.GoogleAuth({
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

const SPREADSHEET_ID = "1sKZcfKe_JgcEqQzXGN1n7CVaTrPVJ1PcR-asZ0Mo02A";
const RANGE = "RSVPs!A:J";

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

// Export Express app as a Firebase HTTPS function
exports.api = functions.https.onRequest(app);
