// server.js or index.js
const express = require("express");
const { google } = require("googleapis");
const cors = require("cors");
const path = require("path");

const app = express();

// ✅ Mobile-safe CORS options
const corsOptions = {
  origin: ["https://amberandstephen.info", "http://localhost:3000"],
  methods: ["POST"],
  credentials: true,
};
app.use(cors(corsOptions));
app.options("/api/submit-rsvp", cors(corsOptions)); // 🧪 allow preflight

app.use(express.json());

// 🔐 Google Sheets Auth
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, "amber-stephen-wedding-027345281640.json"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = "1sKZcfKe_JgcEqQzXGN1n7CVaTrPVJ1PcR-asZ0Mo02A";
const RANGE = "RSVPs!A:J";

// ✅ RSVP submission endpoint
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
