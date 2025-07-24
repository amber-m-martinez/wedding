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
      const response = await fetch(
        `${process.env.REACT_APP_API_URL || ""}/api/submit-rsvp`,
        {
          method: "POST",
          body: JSON.stringify(rsvpData),
          headers: {
            "Content-Type": "application/json",
          },
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
      alert("Error submitting RSVP. Please check your connection.");
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
      style={{ minHeight: "100vh", width: "100vw" }}
    >
      <div className="page-container" style={{ maxWidth: 880, width: "100%" }}>
        <h4 style={{ fontWeight: 700, textAlign: "center", marginBottom: 10 }}>
          RSVP Confirmation
        </h4>
        <p style={{ fontSize: 19, fontWeight: 500, textAlign: "center" }}>
          Please review your RSVP details below.
        </p>

        <div
          style={{ maxWidth: 800, margin: "21px auto 0", padding: "0 20px" }}
        >
          <div
            className="guest-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr",
              gap: 40,
              width: 710,
            }}
          >
            {attendingGuests.map((guest, index) => (
              <div
                key={`${guest.name}-${index}`}
                style={{
                  width: "100%",
                  padding: 20,
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  backgroundColor: "#f9f9f9",
                }}
              >
                <h5 style={{ marginBottom: 15, fontWeight: 700 }}>
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

                <div>
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
            <button onClick={handleBack} className="backButton">
              ← Back
            </button>
            <button
              onClick={sendRSVPToGoogleSheet}
              className="confirmRSVPbutton"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Complete RSVP →"}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ConfirmationPage;
