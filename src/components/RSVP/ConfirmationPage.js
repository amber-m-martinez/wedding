import React, { useState } from "react";
import { motion } from "framer-motion";

function ConfirmationPage({ setStep, guestRSVP }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAllGuests = () => {
    const guests = [];
    Object.keys(guestRSVP).forEach((partyName) => {
      const party = guestRSVP[partyName];
      if (party.guests) {
        Object.values(party.guests).forEach((guest) => {
          const guestWithPrefs = {
            ...guest,
            partyName: partyName,
            mealPreferences: party.mealPreferences?.[guest.name] || {},
          };
          guests.push(guestWithPrefs);
        });
      }
    });
    return guests;
  };

  const attendingGuests = getAllGuests().filter(
    (guest) => guest.welcomeParty || guest.weddingDay
  );

  const prepareRSVPData = () => {
    const rsvpData = {
      timestamp: new Date().toISOString(),
      parties: [],
    };

    Object.keys(guestRSVP).forEach((partyName) => {
      const party = guestRSVP[partyName];
      const partyData = {
        partyName: partyName,
        guests: [],
      };

      if (party.guests) {
        Object.values(party.guests).forEach((guest) => {
          const mealPrefs = party.mealPreferences?.[guest.name] || {};
          partyData.guests.push({
            name: guest.name,
            welcomeParty: guest.welcomeParty || false,
            weddingDay: guest.weddingDay || false,
            entree: mealPrefs.entree || "",
            cake: mealPrefs.cake || "",
            dietaryRestrictions: mealPrefs.dietaryRestrictions || "",
            allergies: mealPrefs.allergies || "",
          });
        });
      }

      partyData.guests = partyData.guests.filter(
        (guest) => guest.welcomeParty || guest.weddingDay
      );

      if (partyData.guests.length > 0) {
        rsvpData.parties.push(partyData);
      }
    });

    return rsvpData;
  };

  const sendRSVPToGoogleSheet = async () => {
    const rsvpData = prepareRSVPData();
    setIsSubmitting(true);

    try {
      // const apiUrl = process.env.REACT_APP_API_URL || "";
      const response = await fetch(
        "https://wedding-r3hc.onrender.com/api/submit-rsvp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(rsvpData),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setStep("Complete RSVP");
      } else {
        alert(result.message || "There was a problem submitting your RSVP.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert(
        `Error submitting RSVP. Please check your connection. ${error.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    setStep("Meal preferences");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ width: "100vw" }}
    >
      <div className="page-container rsvp">
        <h4 style={{ fontWeight: 700, textAlign: "center", marginBottom: 10 }}>
          RSVP Confirmation
        </h4>
        <p style={{ fontSize: 19, fontWeight: 500, textAlign: "center" }}>
          Please review your RSVP details below.
        </p>

        <div style={{ maxWidth: 800, padding: "0 20px", marginTop: 10 }}>
          <div className="guest-grid">
            {attendingGuests.map((guest, index) => (
              <div
                key={`${guest.name}-${index}`}
                className="guestCard"
                style={{
                  backgroundColor: "#f9f9f9",
                  width: 280,
                }}
              >
                <h5 style={{ marginBottom: 15, fontWeight: 700, marginTop: 5 }}>
                  {guest.name}
                </h5>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ marginBottom: 8, fontSize: 17, fontWeight: 700 }}>
                    Attending Events:
                  </p>
                  <p style={{ fontSize: 16 }}>
                    {[
                      guest.weddingDay && "Wedding Day",
                      guest.welcomeParty && "Welcome Party",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>

                {guest.weddingDay && (
                  <div style={{ marginBottom: 20 }}>
                    <h6
                      style={{
                        marginBottom: 9,
                        fontWeight: 700,
                        fontSize: 17,
                        color: "#555",
                      }}
                    >
                      Wedding Day Selections
                    </h6>
                    {guest.mealPreferences.entree && (
                      <p
                        style={{
                          fontSize: 16,
                          fontWeight: 500,
                          marginBottom: 5,
                        }}
                      >
                        Entree: {guest.mealPreferences.entree}
                      </p>
                    )}
                    {guest.mealPreferences.cake && (
                      <p style={{ fontSize: 16, fontWeight: 500 }}>
                        Cake: {guest.mealPreferences.cake}
                      </p>
                    )}
                  </div>
                )}

                <div style={{ marginBottom: -6 }}>
                  <h6 style={{ fontWeight: 700, fontSize: 17 }}>
                    Dietary Information
                  </h6>
                  <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 5 }}>
                    Dietary Restrictions:{" "}
                    {guest.mealPreferences.dietaryRestrictions || "None"}
                  </p>
                  <p style={{ fontSize: 16, fontWeight: 500 }}>
                    Allergies: {guest.mealPreferences.allergies || "None"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 30,
              marginBottom: 120,
            }}
          >
            <div>
              <button onClick={handleBack} className="backButton">
                ← Back
              </button>
            </div>
            <div>
              <button
                onClick={sendRSVPToGoogleSheet}
                disabled={isSubmitting}
                className="completeRSVPButton"
              >
                {isSubmitting ? "Submitting..." : "Complete RSVP →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ConfirmationPage;
