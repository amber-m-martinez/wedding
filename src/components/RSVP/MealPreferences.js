import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useScrollToHeader } from "./rsvp-utils";

function MealPreferences({ setGuestRSVP, setStep, guestRSVP }) {
  const [mealSelections, setMealSelections] = useState({});

  useScrollToHeader(60);

  const getAllGuests = useCallback(() => {
    const guests = [];
    // CRITICAL FIX: Ensure guestRSVP is an object before calling Object.keys
    Object.keys(guestRSVP || {}).forEach((partyName) => {
      const party = guestRSVP[partyName];
      if (party.guests) {
        Object.values(party.guests).forEach((guest) => {
          guests.push({ ...guest, partyName: partyName });
        });
      }
    });
    return guests;
  }, [guestRSVP]);

  const allGuests = useMemo(() => getAllGuests(), [getAllGuests]);

  const attendingGuests = useMemo(() => {
    return allGuests.filter((guest) => {
      return guest.welcomeParty === true || guest.weddingDay === true;
    });
  }, [allGuests]);

  const childGuests = useMemo(
    () =>
      new Set([
        "Claire Gensheimer",
        "Jack Gensheimer",
        "Mia Lecaplain Cáceres",
        "Amadi Vasquez",
      ]),
    []
  );

  const entreeOptions = useMemo(
    () => [
      { name: "Grilled Hanger Steak", description: "GF, dairy" },
      { name: "Roasted Chicken Breast", description: "GF, dairy" },
      { name: "Roasted Eggplant", description: "GF, vegan" },
      { name: "Chicken Fingers", description: "Children's meal" },
    ],
    []
  );

  const cakeOptions = useMemo(
    () => [
      { name: "Lemon Blueberry", description: "Gluten, dairy" },
      { name: "Strawberry Shortcake", description: "Gluten, dairy" },
      { name: "Bananas Foster", description: "Gluten, dairy" },
      { name: "Olive Oil Pistachio & Fig", description: "Gluten, dairy, nuts" },
      { name: "Vanilla & Raspberry Jam", description: "GF, vegan" },
    ],
    []
  );

  const getGuestUniqueId = useCallback((guest) => {
    if (!guest.partyName) {
      console.error(
        "Guest object missing partyName for unique ID generation:",
        guest
      );
      return `noPartyName-${guest.name}`;
    }
    return `${guest.partyName}-${guest.name}`;
  }, []);

  const handleMealSelection = useCallback(
    (guest, mealType, selection) => {
      const guestId = getGuestUniqueId(guest);
      setMealSelections((prev) => ({
        ...prev,
        [guestId]: {
          ...prev[guestId],
          [mealType]: selection,
        },
      }));
    },
    [getGuestUniqueId]
  );

  const handleDietaryInput = useCallback(
    (guest, fieldType, value) => {
      const guestId = getGuestUniqueId(guest);
      setMealSelections((prev) => ({
        ...prev,
        [guestId]: {
          ...prev[guestId], // Keep existing dietary info
          [fieldType]: value, // Set the specific field
        },
      }));
    },
    [getGuestUniqueId]
  );

  // Effect to automatically select "Chicken Fingers" for child guests when they load
  useEffect(() => {
    setMealSelections((prevSelections) => {
      const newSelections = { ...prevSelections };
      attendingGuests.forEach((guest) => {
        if (childGuests.has(guest.name) && guest.weddingDay) {
          // Only if attending wedding day
          const guestId = getGuestUniqueId(guest);
          if (
            !newSelections[guestId] ||
            newSelections[guestId].entree !== "Chicken Fingers"
          ) {
            newSelections[guestId] = {
              ...newSelections[guestId],
              entree: "Chicken Fingers",
            };
          }
        }
      });
      return newSelections;
    });
  }, [attendingGuests, childGuests, getGuestUniqueId]);

  const allRequiredFieldsCompleted = useMemo(() => {
    const isComplete = attendingGuests.every((guest) => {
      const guestId = getGuestUniqueId(guest);
      const selections = mealSelections[guestId];

      let guestComplete = true; // Assume complete by default

      // Only check for entree and cake if the guest is attending the wedding day
      if (guest.weddingDay === true) {
        // If it's a child guest, just check if entree is 'Chicken Fingers'
        if (childGuests.has(guest.name)) {
          guestComplete =
            selections?.entree === "Chicken Fingers" && !!selections?.cake;
        } else {
          // For adult guests, check any entree and cake
          guestComplete = !!selections?.entree && !!selections?.cake;
        }
      }
      return guestComplete;
    });
    return isComplete;
  }, [attendingGuests, mealSelections, getGuestUniqueId, childGuests]); // Added childGuests to dependencies

  const handleNext = useCallback(() => {
    setGuestRSVP((prev) => {
      const updated = { ...prev };

      Object.keys(updated).forEach((partyName) => {
        const party = updated[partyName];
        if (party.guests) {
          if (!updated[partyName].mealPreferences) {
            updated[partyName].mealPreferences = {};
          }

          Object.values(party.guests).forEach((guest) => {
            const guestInPrevState = { ...guest, partyName };
            const guestId = getGuestUniqueId(guestInPrevState);

            const guestSelections = mealSelections[guestId] || {};

            updated[partyName].mealPreferences[guest.name] = {
              dietaryRestrictions: guestSelections.dietaryRestrictions || "",
              allergies: guestSelections.allergies || "",
            };

            if (guest.weddingDay === true) {
              updated[partyName].mealPreferences[guest.name].entree =
                guestSelections.entree || null;
              updated[partyName].mealPreferences[guest.name].cake =
                guestSelections.cake || null;
            }
          });
        }
      });
      return updated;
    });

    setStep("Confirmation page");
  }, [setGuestRSVP, setStep, getGuestUniqueId, mealSelections]);

  const handleBack = useCallback(() => {
    setStep("Guests attending");
  }, [setStep]);

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
          <div
            className={`guest-grid ${
              attendingGuests.length === 1 ? "single-guest" : ""
            }`}
          >
            {attendingGuests.map((guest) => {
              const guestId = getGuestUniqueId(guest);
              const isChild = childGuests.has(guest.name); // Check if current guest is a child

              // Determine which entree options to display
              const currentEntreeOptions = isChild
                ? entreeOptions.filter((opt) => opt.name === "Chicken Fingers")
                : entreeOptions.filter((opt) => opt.name !== "Chicken Fingers"); // Filter out chicken fingers for adults

              return (
                <div key={guestId} className="guestCard mealPreferences">
                  <h5 style={{ marginBottom: 0, fontWeight: 700 }}>
                    {guest.name}
                  </h5>
                  <p style={{ marginBottom: 15 }}>
                    <i>
                      Attending:{" "}
                      {[
                        guest.weddingDay && "Wedding Day",
                        guest.welcomeParty && "Welcome Party",
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </i>
                  </p>

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
                          {currentEntreeOptions.map(
                            (
                              entree // Use currentEntreeOptions here
                            ) => (
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
                                  style={{
                                    accentColor: "#ffdee8",
                                  }}
                                  name={`${guestId}-entree`}
                                  checked={
                                    mealSelections[guestId]?.entree ===
                                    entree.name
                                  }
                                  onChange={() =>
                                    handleMealSelection(
                                      guest,
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
                            )
                          )}
                        </div>
                      </div>

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
                                name={`${guestId}-cake`}
                                checked={
                                  mealSelections[guestId]?.cake === cake.name
                                }
                                onChange={() =>
                                  handleMealSelection(guest, "cake", cake.name)
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

                  <div style={{ marginBottom: 10 }}>
                    <p
                      style={{ marginBottom: 5, fontSize: 18, fontWeight: 500 }}
                    >
                      Dietary Restrictions
                    </p>
                    <textarea
                      value={mealSelections[guestId]?.dietaryRestrictions || ""}
                      onChange={(e) =>
                        handleDietaryInput(
                          guest,
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
                        color: "#5f5f5f",
                      }}
                    />
                  </div>

                  <div>
                    <p
                      style={{ marginBottom: 5, fontSize: 18, fontWeight: 500 }}
                    >
                      Allergies
                    </p>
                    <textarea
                      value={mealSelections[guestId]?.allergies || ""}
                      onChange={(e) =>
                        handleDietaryInput(guest, "allergies", e.target.value)
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
                        color: "#5f5f5f",
                      }}
                    />
                  </div>
                </div>
              );
            })}
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
