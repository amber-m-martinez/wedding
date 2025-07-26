import React, { useState, useEffect, useMemo } from "react";
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

  const guestParties = {
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
  };

  const createGuestList = () => {
    const rawNames = normalizedGuestSelected
      .split(" & ")
      .map((name) => name.trim());

    const guests = [];

    if (
      rawNames.length === 2 &&
      !rawNames[0].includes(" ") &&
      rawNames[1].includes(" ")
    ) {
      const lastName = rawNames[1].split(" ").pop();
      guests.push({
        id: 1,
        name: `${rawNames[0]} ${lastName}`,
        isMainGuest: true,
      });
      guests.push({ id: 2, name: rawNames[1], isMainGuest: false });
    } else {
      rawNames.forEach((name, index) => {
        guests.push({
          id: index + 1,
          name,
          isMainGuest: index === 0,
        });
      });
    }

    const remainingGuests = Math.max(0, (guestCount || 0) - guests.length);
    const mainGuestName = guests[0]?.name || "";
    const specificGuests = guestParties[mainGuestName] || [];

    for (let i = 0; i < remainingGuests; i++) {
      guests.push({
        id: guests.length + 1,
        name: specificGuests[i] || `Guest ${guests.length + 1}`,
        isMainGuest: false,
      });
    }

    return guests.slice(0, guestCount || guests.length);
  };

  const guests = useMemo(createGuestList, [
    normalizedGuestSelected,
    guestCount,
  ]);

  const handleAttendanceChange = (guest, event, isAttending) => {
    setIndividualResponses((prev) => ({
      ...prev,
      [guest.id]: {
        ...prev[guest.id],
        [event]: isAttending,
        allEvents: false,
        noEvents: false,
      },
    }));
  };

  const handleBulkAttendanceChange = (guest, type, checked) => {
    setIndividualResponses((prev) => ({
      ...prev,
      [guest.id]: {
        ...prev[guest.id],
        [type]: checked,
        [type === "allEvents" ? "noEvents" : "allEvents"]: false,
        welcomeParty:
          type === "allEvents"
            ? checked
            : type === "noEvents"
            ? false
            : prev[guest.id]?.welcomeParty,
        weddingDay:
          type === "allEvents"
            ? checked
            : type === "noEvents"
            ? false
            : prev[guest.id]?.weddingDay,
      },
    }));
  };

  // Fixed sync effect - now stores complete guest data, not just counts
  useEffect(() => {
    const welcomePartyCount = guests.filter(
      (g) => individualResponses[g.id]?.welcomeParty === true
    ).length;
    const weddingDayCount = guests.filter(
      (g) => individualResponses[g.id]?.weddingDay === true
    ).length;

    if (normalizedGuestSelected && guestCount > 0) {
      // Create guest details with responses
      const guestDetails = guests.reduce((acc, guest) => {
        const response = individualResponses[guest.id];
        acc[guest.id] = {
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

  const allResponded = guests.every((guest) => {
    const r = individualResponses[guest.id];
    return (
      typeof r?.welcomeParty === "boolean" && typeof r?.weddingDay === "boolean"
    );
  });

  const anyAttending = guests.some((guest) => {
    const r = individualResponses[guest.id];
    return r?.welcomeParty === true || r?.weddingDay === true;
  });

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
              const response = individualResponses[guest.id] || {};
              return (
                <div key={guest.id} className="guestCard">
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
                      Welcome Drinks
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
                            : "default"
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
                            : "default"
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
                          response.weddingDay === true ? "attending" : "default"
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
                            : "default"
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
