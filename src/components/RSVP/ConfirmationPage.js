import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollToHeader } from "./rsvp-utils";

function ConfirmationPage({ setStep, guestRSVP }) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useScrollToHeader(60);

  const entreeOptions = [
    { name: "Grilled Hanger Steak", description: "GF, dairy" },
    { name: "Roasted Chicken Breast", description: "GF, dairy" },
  ];

  const cakeOptions = [
    { name: "Lemon Blueberry", description: "Gluten, dairy" },
    { name: "Strawberry Shortcake", description: "Gluten, dairy" },
    { name: "Bananas Foster", description: "Gluten, dairy" },
    { name: "Olive Oil Pistachio & Fig", description: "Gluten, dairy, nuts" },
    { name: "Vanilla & Raspberry Jam", description: "GF, vegan" },
  ];

  const getDescription = (options, name) => {
    const option = options.find((opt) => opt.name === name);
    return option ? option.description : "";
  };

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

  const allGuests = getAllGuests();

  // In ConfirmationPage.js (your frontend component)

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
    const hasAttendingGuests = allGuests.some(
      (guest) => guest.weddingDay || guest.welcomeParty
    );

    if (hasAttendingGuests) {
      setStep("Meal preferences");
    } else {
      setStep("Guests attending");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-container rsvp">
        <h4 style={{ fontWeight: 700, textAlign: "center", marginBottom: 10 }}>
          RSVP Confirmation
        </h4>
        <p style={{ fontSize: 19, fontWeight: 500, textAlign: "center" }}>
          Please review your RSVP details below.
        </p>

        {/* Guest cards */}
        <div
          className="cards-container"
          style={{
            // width: 800, // This was commented out, but we need to control width
            marginTop: 10,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 20,
            maxWidth: 740, // Max width for two 350px cards + 20px gap
            margin: "10px auto", // Center the container horizontally
          }}
        >
          {allGuests.map((guest, index) => {
            const attendingAny = guest.weddingDay || guest.welcomeParty;

            return (
              <div
                key={`${guest.name}-${index}`}
                className="guestCard"
                style={{ backgroundColor: "#f9f9f9", width: 350 }}
              >
                <h5 style={{ marginBottom: 15, fontWeight: 700, marginTop: 5 }}>
                  {guest.name}
                </h5>
                <div style={{ marginBottom: 20 }}>
                  <p style={{ marginBottom: 8, fontSize: 17, fontWeight: 700 }}>
                    Attending Events:
                  </p>
                  <p style={{ fontSize: 16 }}>
                    {attendingAny
                      ? [
                          guest.weddingDay && "Wedding Day",
                          guest.welcomeParty && "Welcome Party",
                        ]
                          .filter(Boolean)
                          .join(", ")
                      : "Not attending any events"}
                  </p>
                </div>

                {guest.weddingDay && (
                  <div style={{ marginBottom: 20 }}>
                    <h6
                      style={{
                        marginBottom: 9,
                        fontWeight: 700,
                        fontSize: 17,
                        color: "#5f5f5f",
                      }}
                    >
                      Wedding Day Selections
                    </h6>
                    {guest.mealPreferences.entree && (
                      <p
                        style={{
                          fontSize: 16,
                          marginBottom: 5,
                        }}
                      >
                        Entree: {guest.mealPreferences.entree}
                        {getDescription(
                          entreeOptions,
                          guest.mealPreferences.entree
                        ) && (
                          <span
                            style={{
                              marginLeft: 6,
                              fontStyle: "italic",
                              color: "#666",
                              fontSize: 14,
                            }}
                          >
                            (
                            {getDescription(
                              entreeOptions,
                              guest.mealPreferences.entree
                            )}
                            )
                          </span>
                        )}
                      </p>
                    )}
                    {guest.mealPreferences.cake && (
                      <p style={{ fontSize: 16 }}>
                        Cake: {guest.mealPreferences.cake}
                        {getDescription(
                          cakeOptions,
                          guest.mealPreferences.cake
                        ) && (
                          <span
                            style={{
                              marginLeft: 6,
                              fontStyle: "italic",
                              color: "#666",
                              fontSize: 14,
                            }}
                          >
                            (
                            {getDescription(
                              cakeOptions,
                              guest.mealPreferences.cake
                            )}
                            )
                          </span>
                        )}
                      </p>
                    )}
                  </div>
                )}

                {attendingAny && (
                  <div style={{ marginBottom: 10 }}>
                    <h6
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 8,
                      }}
                    >
                      Dietary Information
                    </h6>
                    <p style={{ fontSize: 16, marginBottom: 5 }}>
                      Dietary Restrictions:{" "}
                      {guest.mealPreferences.dietaryRestrictions || "None"}
                    </p>
                    <p style={{ fontSize: 16 }}>
                      Allergies: {guest.mealPreferences.allergies || "None"}
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Buttons container */}
          <div
            className="buttonsContainer"
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <button
              onClick={handleBack}
              className="backButton"
              style={{
                borderRadius: 6,
                cursor: "pointer",
                width: "auto",
                margin: 0,
              }}
            >
              ← Back
            </button>
            <button
              onClick={sendRSVPToGoogleSheet}
              disabled={isSubmitting}
              className="completeRSVPButton"
              style={{
                borderRadius: 6,
                cursor: isSubmitting ? "not-allowed" : "pointer",
                width: "auto",
                margin: 0,
              }}
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
