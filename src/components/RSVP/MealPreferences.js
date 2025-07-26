import { useState } from "react";
import { motion } from "framer-motion";
import { useScrollToHeader } from "./rsvp-utils";

function MealPreferences({ setGuestRSVP, setStep, guestRSVP }) {
  const [mealSelections, setMealSelections] = useState({});

  useScrollToHeader(60);

  // Get all guests from guestRSVP
  const getAllGuests = () => {
    const guests = [];

    // Iterate through all guest parties in guestRSVP
    Object.keys(guestRSVP).forEach((partyName) => {
      const party = guestRSVP[partyName];
      if (party.guests) {
        Object.values(party.guests).forEach((guest) => {
          guests.push(guest);
        });
      }
    });

    return guests;
  };

  const allGuests = getAllGuests();

  // Filter guests who said yes to at least one event
  const attendingGuests = allGuests.filter((guest) => {
    return guest.welcomeParty === true || guest.weddingDay === true;
  });

  const entreeOptions = [
    {
      name: "Grilled Hanger Steak",
      description: "GF, dairy",
    },
    {
      name: "Roasted Chicken Breast",
      description: "GF, dairy",
    },
  ];

  const cakeOptions = [
    {
      name: "Lemon Blueberry",
      description: "Gluten, dairy",
    },
    {
      name: "Strawberry Shortcake",
      description: "Gluten, dairy",
    },
    {
      name: "Bananas Foster",
      description: "Gluten, dairy",
    },
    {
      name: "Olive Oil Pistachio & Fig",
      description: "Gluten, dairy, nuts",
    },
    {
      name: "Vanilla & Raspberry Jam",
      description: "GF, vegan",
    },
  ];

  const handleMealSelection = (guestName, mealType, selection) => {
    setMealSelections((prev) => ({
      ...prev,
      [guestName]: {
        ...prev[guestName],
        [mealType]: selection,
      },
    }));
  };

  const handleDietaryInput = (guestName, fieldType, value) => {
    setMealSelections((prev) => ({
      ...prev,
      [guestName]: {
        ...prev[guestName],
        [fieldType]: value,
      },
    }));
  };

  // Check if all attending guests have made their meal selections and all guests have completed dietary fields
  const allRequiredFieldsCompleted = attendingGuests.every((guest) => {
    const selections = mealSelections[guest.name];
    const dietaryRestrictions = selections?.dietaryRestrictions || "";
    const allergies = selections?.allergies || "";

    // For wedding day guests, they need meal selections too
    if (guest.weddingDay === true) {
      return (
        selections &&
        selections.entree &&
        selections.cake &&
        dietaryRestrictions !== undefined &&
        allergies !== undefined
      );
    }

    // For non-wedding day guests, just need dietary fields
    return dietaryRestrictions !== undefined && allergies !== undefined;
  });

  const handleNext = () => {
    // Update guestRSVP with meal preferences
    setGuestRSVP((prev) => {
      const updated = { ...prev };

      // Add meal preferences for each guest party
      Object.keys(updated).forEach((partyName) => {
        const party = updated[partyName];
        if (party.guests) {
          // Initialize mealPreferences if it doesn't exist
          if (!updated[partyName].mealPreferences) {
            updated[partyName].mealPreferences = {};
          }

          // Add meal preferences and dietary info for all guests
          Object.values(party.guests).forEach((guest) => {
            if (mealSelections[guest.name]) {
              const guestSelections = mealSelections[guest.name];
              updated[partyName].mealPreferences[guest.name] = {
                dietaryRestrictions: guestSelections.dietaryRestrictions || "",
                allergies: guestSelections.allergies || "",
              };

              // Only add meal selections for wedding day attendees
              if (guest.weddingDay === true) {
                updated[partyName].mealPreferences[guest.name].entree =
                  guestSelections.entree;
                updated[partyName].mealPreferences[guest.name].cake =
                  guestSelections.cake;
              }
            }
          });
        }
      });

      return updated;
    });

    setStep("Confirmation page");
  };

  const handleBack = () => {
    setStep("Guests attending");
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
          Meal Preferences
        </h4>
        <p style={{ fontSize: 19, fontWeight: 500, textAlign: "center" }}>
          Please confirm meal preferences for each guest below.
        </p>

        <div
          style={{
            maxWidth: 800,
            padding: "0 20px",
            marginTop: 10,
          }}
        >
          <div className="guest-grid">
            {attendingGuests.map((guest, index) => (
              <div
                key={`${guest.name}-${index}`}
                className="guestCard mealPreferences"
              >
                <h5 style={{ marginBottom: 0, fontWeight: 700 }}>
                  {guest.name}
                </h5>
                <p style={{ marginBottom: 15 }}>
                  <i>
                    Attending:{" "}
                    {[
                      guest.weddingDay && "Wedding Day",
                      guest.welcomeParty && "Welcome Drinks",
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </i>
                </p>

                {/* Only show meal selections for wedding day attendees */}
                {guest.weddingDay === true && (
                  <>
                    <h6
                      style={{
                        marginBottom: 15,
                        marginTop: 20,
                        fontWeight: 600,
                        fontSize: 16,
                        color: "#555",
                      }}
                    >
                      Wedding Day Selections
                    </h6>
                    {/* Entree Selection */}
                    <div style={{ marginBottom: 15 }}>
                      <p
                        style={{
                          marginBottom: 5,
                          fontSize: 18,
                          fontWeight: 500,
                        }}
                      >
                        Entree Selection
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {entreeOptions.map((entree) => (
                          <label
                            key={entree.name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              cursor: "pointer",
                              userSelect: "none",
                            }}
                          >
                            <input
                              type="radio"
                              style={{ accentColor: "#ffdee8" }}
                              name={`${guest.name}-entree`}
                              checked={
                                mealSelections[guest.name]?.entree ===
                                entree.name
                              }
                              onChange={() =>
                                handleMealSelection(
                                  guest.name,
                                  "entree",
                                  entree.name
                                )
                              }
                            />
                            <span>
                              {entree.name}{" "}
                              <span
                                style={{
                                  fontSize: 14,
                                  color: "#666",
                                  fontStyle: "italic",
                                }}
                              >
                                {entree.description}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Cake Selection */}
                    <div style={{ marginBottom: 15 }}>
                      <p
                        style={{
                          marginBottom: 5,
                          fontSize: 18,
                          fontWeight: 500,
                        }}
                      >
                        Cake Selection
                      </p>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        {cakeOptions.map((cake) => (
                          <label
                            key={cake.name}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                              cursor: "pointer",
                              userSelect: "none",
                            }}
                          >
                            <input
                              type="radio"
                              style={{ accentColor: "#ffdee8" }}
                              name={`${guest.name}-cake`}
                              checked={
                                mealSelections[guest.name]?.cake === cake.name
                              }
                              onChange={() =>
                                handleMealSelection(
                                  guest.name,
                                  "cake",
                                  cake.name
                                )
                              }
                            />
                            <span>
                              {cake.name}
                              &nbsp;
                              <span
                                style={{
                                  fontSize: 14,
                                  color: "#666",
                                  fontStyle: "italic",
                                }}
                              >
                                {cake.description}
                              </span>
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Dietary Information - shown for all attending guests */}
                <div style={{ marginBottom: 10 }}>
                  <p style={{ marginBottom: 5, fontSize: 18, fontWeight: 500 }}>
                    Dietary Restrictions
                  </p>
                  <textarea
                    value={
                      mealSelections[guest.name]?.dietaryRestrictions || ""
                    }
                    onChange={(e) =>
                      handleDietaryInput(
                        guest.name,
                        "dietaryRestrictions",
                        e.target.value
                      )
                    }
                    placeholder="Please list any dietary restrictions..."
                    style={{
                      width: "100%",
                      height: 44,
                      padding: 8,
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>

                <div>
                  <p style={{ marginBottom: 5, fontSize: 18, fontWeight: 500 }}>
                    Allergies
                  </p>
                  <textarea
                    value={mealSelections[guest.name]?.allergies || ""}
                    onChange={(e) =>
                      handleDietaryInput(
                        guest.name,
                        "allergies",
                        e.target.value
                      )
                    }
                    placeholder="Please list any food allergies..."
                    style={{
                      width: "100%",
                      height: 44,
                      padding: 8,
                      border: "1px solid #ccc",
                      borderRadius: 4,
                      resize: "vertical",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              justifyContent: "space-between",
              marginTop: 30,
              marginBottom: 120,
              display: "flex",
            }}
          >
            <div>
              <button onClick={handleBack} className="backButton">
                ← Back
              </button>
            </div>
            <div className="tooltip-wrapper">
              <button
                disabled={!allRequiredFieldsCompleted}
                onClick={handleNext}
                className={`select-meal-button ${
                  allRequiredFieldsCompleted ? "enabled" : ""
                }`}
              >
                Confirm RSVP →
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default MealPreferences;
