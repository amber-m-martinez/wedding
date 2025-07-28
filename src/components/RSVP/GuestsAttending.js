import React, { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useScrollToHeader } from "./rsvp-utils";

function GuestsAttending({
  guestList,
  setStep,
  guestSelected,
  setGuestSelected,
  setGuestRSVP,
}) {
  const [nextStep, setNextStep] = useState(null);
  const [individualResponses, setIndividualResponses] = useState({});

  useScrollToHeader(60);

  useEffect(() => {
    if (guestSelected === "Salvador Martinez (Father of the bride)") {
      setGuestSelected("Salvador Martinez");
    }
  }, [guestSelected, setGuestSelected]);

  const normalizedGuestSelected = useMemo(() => {
    return guestSelected === "Salvador Martinez (Father of the bride)"
      ? "Salvador Martinez"
      : guestSelected;
  }, [guestSelected]);

  const guestEntry =
    guestList.find((entry) => entry.name === normalizedGuestSelected) ||
    guestList.find(
      (entry) => entry.name === "Salvador Martinez (Father of the bride)"
    );

  const guestCount = guestEntry?.guest_count;

  const guestParties = useMemo(
    () => ({
      "Salvador Martinez": [
        "Michelle Martinez",
        "Ana De Los Santos",
        "Mama",
        "Papa",
        "Lindo Martinez",
        "Elijah Martinez",
        "Princess",
      ],
      "Juliana Martinez": ["Julian Martinez", "Josh Martinez"],
      "Lina Martinez": ["Valentina Suarez"],
      "Isabella Martinez": ["Hieu Tran"],
      "Stephanie Gensheimer": [
        "Steve Gensheimer",
        "Claire Gensheimer",
        "Jack Gensheimer",
      ],
      "Laura Cáceres": ["Maxime Lecaplain", "Mia Lecaplain Cáceres"],
      "Ingrid Lapaix": ["Luis Baez", "Ana Elisa De Los Santos"],
      "Lizzie Pradel": ["Amadi Martinez"],
    }),
    []
  );

  const getUniqueGuestId = useCallback(
    (name) => `${normalizedGuestSelected}-${name}`,
    [normalizedGuestSelected]
  );

  const createGuestList = useCallback(() => {
    const rawNames = normalizedGuestSelected
      .split(" & ")
      .map((name) => name.trim());

    const guests = [];
    const addedNames = new Set();

    if (
      rawNames.length === 2 &&
      !rawNames[0].includes(" ") &&
      rawNames[1].includes(" ")
    ) {
      const lastName = rawNames[1].split(" ").pop();
      const guest1Name = `${rawNames[0]} ${lastName}`;
      if (!addedNames.has(guest1Name)) {
        guests.push({
          uniqueId: getUniqueGuestId(guest1Name),
          name: guest1Name,
          isMainGuest: true,
        });
        addedNames.add(guest1Name);
      }
      if (!addedNames.has(rawNames[1])) {
        guests.push({
          uniqueId: getUniqueGuestId(rawNames[1]),
          name: rawNames[1],
          isMainGuest: false,
        });
        addedNames.add(rawNames[1]);
      }
    } else {
      rawNames.forEach((name) => {
        if (!addedNames.has(name)) {
          guests.push({
            uniqueId: getUniqueGuestId(name),
            name,
            isMainGuest: guests.length === 0,
          });
          addedNames.add(name);
        }
      });
    }

    const mainGuestNameForParty = guests[0]?.name || "";
    const specificGuestsFromParty = guestParties[mainGuestNameForParty] || [];

    for (const name of specificGuestsFromParty) {
      if (guests.length >= (guestCount || Infinity)) break;
      if (!addedNames.has(name)) {
        guests.push({
          uniqueId: getUniqueGuestId(name),
          name,
          isMainGuest: false,
        });
        addedNames.add(name);
      }
    }

    while (guests.length < (guestCount || 0)) {
      const newGuestName = `Guest ${guests.length + 1}`;
      const uniqueNewGuestName = newGuestName;
      if (!addedNames.has(uniqueNewGuestName)) {
        guests.push({
          uniqueId: getUniqueGuestId(uniqueNewGuestName),
          name: uniqueNewGuestName,
          isMainGuest: false,
        });
        addedNames.add(uniqueNewGuestName);
      }
    }

    return guests.slice(0, guestCount || guests.length);
  }, [normalizedGuestSelected, guestCount, guestParties, getUniqueGuestId]);

  const guests = useMemo(createGuestList, [createGuestList]);

  const handleAttendanceChange = useCallback((guest, event, isAttending) => {
    setIndividualResponses((prev) => ({
      ...prev,
      [guest.uniqueId]: {
        ...prev[guest.uniqueId],
        [event]: isAttending,
        allEvents: false,
        noEvents: false,
      },
    }));
  }, []);

  const handleBulkAttendanceChange = useCallback((guest, type, checked) => {
    setIndividualResponses((prev) => {
      const currentGuestResponse = prev[guest.uniqueId] || {};
      let newWelcomeParty = currentGuestResponse.welcomeParty;
      let newWeddingDay = currentGuestResponse.weddingDay;

      if (checked) {
        // If the bulk checkbox is CHECKED
        if (type === "allEvents") {
          newWelcomeParty = true;
          newWeddingDay = true;
        } else if (type === "noEvents") {
          newWelcomeParty = false;
          newWeddingDay = false;
        }
      } else {
        // If the bulk checkbox is UNCHECKED, revert individual events to undefined
        newWelcomeParty = undefined;
        newWeddingDay = undefined;
      }

      return {
        ...prev,
        [guest.uniqueId]: {
          ...currentGuestResponse,
          [type]: checked,
          [type === "allEvents" ? "noEvents" : "allEvents"]: false, // Uncheck the opposite bulk option
          welcomeParty: newWelcomeParty,
          weddingDay: newWeddingDay,
        },
      };
    });
  }, []);

  useEffect(() => {
    const welcomePartyCount = guests.filter(
      (g) => individualResponses[g.uniqueId]?.welcomeParty === true
    ).length;
    const weddingDayCount = guests.filter(
      (g) => individualResponses[g.uniqueId]?.weddingDay === true
    ).length;

    if (normalizedGuestSelected && guestCount > 0) {
      const guestDetails = guests.reduce((acc, guest) => {
        const response = individualResponses[guest.uniqueId];
        acc[guest.name] = {
          name: guest.name,
          welcomeParty: response?.welcomeParty || false,
          weddingDay: response?.weddingDay || false,
          allEvents: response?.allEvents || false,
          noEvents: response?.noEvents || false,
        };
        return acc;
      }, {});

      setGuestRSVP((prev) => ({
        ...(prev || {}),
        [normalizedGuestSelected]: {
          ...(prev?.[normalizedGuestSelected] || {}),
          guests: guestDetails,
          RSVP: {
            welcomeParty: welcomePartyCount,
            weddingDay: weddingDayCount,
          },
        },
      }));
    }
  }, [
    individualResponses,
    guests,
    normalizedGuestSelected,
    guestCount,
    setGuestRSVP,
  ]);

  const allResponded = useMemo(() => {
    return guests.every((guest) => {
      const r = individualResponses[guest.uniqueId];
      return (
        (typeof r?.welcomeParty === "boolean" &&
          typeof r?.weddingDay === "boolean") ||
        r?.allEvents === true ||
        r?.noEvents === true
      );
    });
  }, [guests, individualResponses]);

  const anyAttending = useMemo(() => {
    return guests.some((guest) => {
      const r = individualResponses[guest.uniqueId];
      return r?.welcomeParty === true || r?.weddingDay === true;
    });
  }, [guests, individualResponses]);

  useEffect(() => {
    if (allResponded) {
      setNextStep(anyAttending ? "Meal preferences" : "Confirmation page");
    } else {
      setNextStep(null);
    }
  }, [allResponded, anyAttending]);

  const buttonText = allResponded
    ? anyAttending
      ? "Next: Select meal preferences \u00A0⇨"
      : "Confirm RSVP \u00A0⇨"
    : "Next \u00A0⇨";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{ margin: "0px 10px" }}
    >
      <div className="page-container rsvp">
        <h4 style={{ fontWeight: 700, textAlign: "center", marginBottom: 10 }}>
          RSVP
        </h4>
        <p style={{ fontSize: 19, fontWeight: 500, textAlign: "center" }}>
          {normalizedGuestSelected}, you have <b>{guestCount}</b>{" "}
          {guestCount === 1 ? "member" : "members"} in your party.
        </p>
        <p
          style={{
            marginTop: -8,
            fontSize: 19,
            fontWeight: 500,
            textAlign: "center",
          }}
        >
          Please confirm attendance for each guest below.
        </p>

        <div style={{ maxWidth: 800, marginTop: 10, padding: "0 20px" }}>
          <div
            className={`guest-grid ${
              guests.length === 1 ? "single-guest" : ""
            }`}
          >
            {guests.map((guest) => {
              const response = individualResponses[guest.uniqueId] || {};
              return (
                <div key={guest.uniqueId} className="guestCard">
                  <h5 style={{ marginBottom: 9, fontWeight: 700 }}>
                    {guest.name}
                  </h5>

                  <div style={{ marginBottom: 2 }}>
                    <label
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <input
                        type="checkbox"
                        style={{ accentColor: "#ffdee8" }}
                        checked={response.allEvents || false}
                        onChange={(e) =>
                          handleBulkAttendanceChange(
                            guest,
                            "allEvents",
                            e.target.checked
                          )
                        }
                      />
                      <span>Attending all events.</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: 10 }}>
                    <label
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <input
                        type="checkbox"
                        style={{ accentColor: "#ffdee8" }}
                        checked={response.noEvents || false}
                        onChange={(e) =>
                          handleBulkAttendanceChange(
                            guest,
                            "noEvents",
                            e.target.checked
                          )
                        }
                      />
                      <span>Not attending any events.</span>
                    </label>
                  </div>

                  <div style={{ marginBottom: 20 }}>
                    <p
                      style={{
                        marginBottom: -22,
                        fontSize: 18,
                        fontWeight: 500,
                      }}
                    >
                      Welcome Party
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() =>
                          handleAttendanceChange(guest, "welcomeParty", true)
                        }
                        disabled={response.allEvents || response.noEvents}
                        className={`attendance-button ${
                          response.welcomeParty === true
                            ? "attending"
                            : "default" // Only default if not explicitly true
                        }`}
                      >
                        Attending
                      </button>
                      <button
                        onClick={() =>
                          handleAttendanceChange(guest, "welcomeParty", false)
                        }
                        disabled={response.allEvents || response.noEvents}
                        className={`attendance-button ${
                          response.welcomeParty === false
                            ? "not-attending"
                            : "default" // Only default if not explicitly false
                        }`}
                      >
                        Not Attending
                      </button>
                    </div>
                  </div>

                  <div>
                    <p
                      style={{
                        marginBottom: -22,
                        fontSize: 18,
                        fontWeight: 500,
                      }}
                    >
                      Wedding Day
                    </p>
                    <div style={{ display: "flex", gap: 10 }}>
                      <button
                        onClick={() =>
                          handleAttendanceChange(guest, "weddingDay", true)
                        }
                        disabled={response.allEvents || response.noEvents}
                        className={`attendance-button ${
                          response.weddingDay === true ? "attending" : "default" // Only default if not explicitly true
                        }`}
                      >
                        Attending
                      </button>
                      <button
                        onClick={() =>
                          handleAttendanceChange(guest, "weddingDay", false)
                        }
                        disabled={response.allEvents || response.noEvents}
                        className={`attendance-button ${
                          response.weddingDay === false
                            ? "not-attending"
                            : "default" // Only default if not explicitly false
                        }`}
                      >
                        Not Attending
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mealPreferencesButtonContainer">
            <div className="tooltip-wrapper">
              <button
                disabled={!allResponded}
                onClick={() => allResponded && setStep(nextStep)}
                className={`select-meal-button ${
                  allResponded ? "enabled" : ""
                }`}
              >
                {buttonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default GuestsAttending;
