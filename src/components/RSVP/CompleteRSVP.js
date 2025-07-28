import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useScrollToHeader } from "./rsvp-utils";

function CompleteRSVP({ guestRSVP }) {
  useScrollToHeader(60);

  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

  // Entree and cake options with descriptions
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

  // Helper function to get description from options by name
  const getDescription = (options, name) => {
    const option = options.find((opt) => opt.name === name);
    return option ? option.description : "";
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const normalizeRSVPDataForEmail = (originalRSVP) => {
    const parties = [];

    Object.entries(originalRSVP).forEach(([partyName, party]) => {
      const guestsArray = Object.values(party.guests || {});
      const mealPreferences = party.mealPreferences || {};

      parties.push({
        partyName,
        guests: guestsArray.map((guest) => ({
          name: guest.name,
          welcomeParty: guest.welcomeParty,
          weddingDay: guest.weddingDay,
        })),
        mealPreferences,
      });
    });

    return { parties };
  };

  const hasAttendingGuests = () => {
    return Object.keys(guestRSVP).some((partyName) => {
      const party = guestRSVP[partyName];
      if (party.guests) {
        return Object.values(party.guests).some(
          (guest) => guest.welcomeParty === true || guest.weddingDay === true
        );
      }
      return false;
    });
  };

  const anyoneAttending = hasAttendingGuests();

  const formatRSVPForDisplay = () => {
    const summary = {
      parties: [],
      totalWeddingDay: 0,
      totalWelcomeParty: 0,
    };

    Object.entries(guestRSVP).forEach(([partyName, party]) => {
      if (party.guests) {
        const partyGuests = Object.values(party.guests);
        const weddingDayCount = partyGuests.filter(
          (guest) => guest.weddingDay
        ).length;
        const welcomePartyCount = partyGuests.filter(
          (guest) => guest.welcomeParty
        ).length;

        summary.parties.push({
          name: partyName,
          guests: partyGuests,
          weddingDayCount,
          welcomePartyCount,
          mealPreferences: party.mealPreferences || {},
        });

        summary.totalWeddingDay += weddingDayCount;
        summary.totalWelcomeParty += welcomePartyCount;
      }
    });

    return summary;
  };

  const rsvpSummary = formatRSVPForDisplay();

  const handleEmailButtonClick = () => {
    setShowEmailInput(true);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      alert("Email address is required to send confirmation.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      alert("Please enter a valid email address.");
      return;
    }

    await sendConfirmationEmail(trimmedEmail);
  };

  const sendConfirmationEmail = async (emailAddress) => {
    setSendingEmail(true);

    const rsvpDataForEmail = normalizeRSVPDataForEmail(guestRSVP);

    try {
      const response = await fetch(
        "https://wedding-r3hc.onrender.com/api/send-rsvp-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            to: emailAddress,
            rsvpData: rsvpDataForEmail,
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setEmailSent(true);
        setShowEmailInput(false);
      } else {
        throw new Error(
          result.message || result.error || "Email sending failed"
        );
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert(
        `Error sending email: ${error.message}\n\nPlease save this page or take a screenshot for your records.`
      );
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="page-container rsvp" style={{ marginBottom: 70 }}>
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#e8f5e8",
            border: "1px solid #c3e6c3",
            borderRadius: 4,
            marginBottom: 25,
            color: "#2d5016",
            width: "370px",
            alignSelf: "center",
          }}
        >
          <h5 style={{ marginBottom: 10 }}>RSVP Successfully Submitted!</h5>
          <p style={{ fontSize: 16, margin: 0 }}>
            {anyoneAttending
              ? "We look forward to celebrating with you!"
              : "Thank you for letting us know!"}
          </p>
          <div
            style={{
              textAlign: "center",
              marginBottom: 5,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="wait">
              {!emailSent ? (
                <motion.div
                  key="email-section"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0 }}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                  }}
                >
                  <AnimatePresence mode="wait">
                    {!showEmailInput ? (
                      <motion.button
                        key="email-button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 1 }}
                        transition={{ duration: 0.3, exit: { duration: 0 } }}
                        onClick={handleEmailButtonClick}
                        style={{ marginTop: 19, width: "auto" }}
                        className="emailConfirmation"
                      >
                        Email me a confirmation
                      </motion.button>
                    ) : (
                      <motion.div
                        key="email-form"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 1 }}
                        transition={{ duration: 0.3, exit: { duration: 0 } }}
                        style={{
                          maxWidth: "400px",
                          margin: "0 auto",
                          marginTop: 10,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                        }}
                      >
                        <p>Share your email address:</p>
                        <form
                          onSubmit={handleEmailSubmit}
                          style={{ width: "100%" }}
                        >
                          <div
                            style={{ marginBottom: 10, textAlign: "center" }}
                          >
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email address"
                              required
                              style={{
                                padding: "10px 12px",
                                borderRadius: 4,
                                border: "1px solid #ccc",
                                fontSize: 14,
                                width: 260,
                                boxSizing: "border-box",
                              }}
                            />
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              gap: 10,
                              marginTop: 10,
                            }}
                          >
                            <button
                              type="submit"
                              className="emailConfirmationButton"
                              disabled={sendingEmail}
                              style={{
                                backgroundColor: "#2d5016",
                                color: "white",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: 4,
                                fontSize: 14,
                                cursor: sendingEmail
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: sendingEmail ? 0.6 : 1,
                                minWidth: 80,
                              }}
                            >
                              {sendingEmail ? "Sending..." : "Send"}
                            </button>
                            <button
                              type="button"
                              className="emailConfirmationButton"
                              onClick={() => setShowEmailInput(false)}
                              disabled={sendingEmail}
                              style={{
                                backgroundColor: "#6c757d",
                                color: "white",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: 4,
                                fontSize: 14,
                                cursor: sendingEmail
                                  ? "not-allowed"
                                  : "pointer",
                                opacity: sendingEmail ? 0.6 : 1,
                                minWidth: 80,
                              }}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    padding: "12px",
                    backgroundColor: "#d4edda",
                    border: "1px solid #c3e6cb",
                    borderRadius: 4,
                    color: "#155724",
                    marginTop: 15,
                  }}
                >
                  ✓ Confirmation email sent successfully!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {anyoneAttending && (
          <motion.div
            layout
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: 4,
              padding: "20px",
              marginBottom: 20,
              width: 370,
            }}
          >
            <p
              style={{
                fontWeight: 600,
                marginBottom: 10,
                fontSize: 17,
              }}
            >
              Your RSVP Summary:
            </p>

            {rsvpSummary.parties.map((party, partyIndex) => (
              <div
                key={partyIndex}
                style={{ marginBottom: 20, color: "#5f5f5f" }}
              >
                <p
                  style={{
                    fontWeight: 650,
                    marginBottom: 10,
                    fontSize: 16,
                    marginLeft: 6,
                  }}
                >
                  Attendance:
                </p>
                <div style={{ marginBottom: 15, fontSize: 16 }}>
                  {party.guests.map((guest, guestIndex) => (
                    <div
                      key={guestIndex}
                      style={{ marginLeft: 12, marginBottom: 8 }}
                    >
                      <p style={{ margin: "2px 0", fontWeight: 550 }}>
                        {guest.name}
                      </p>
                      <p style={{ margin: "2px 0", fontSize: 16 }}>
                        Events:{" "}
                        {!guest.welcomeParty && !guest.weddingDay
                          ? "Not Attending"
                          : `${guest.welcomeParty ? "Welcome Party" : ""}${
                              guest.welcomeParty && guest.weddingDay ? ", " : ""
                            }${guest.weddingDay ? "Wedding Day" : ""}`}
                      </p>
                    </div>
                  ))}
                </div>

                {party.mealPreferences &&
                  Object.keys(party.mealPreferences).length > 0 && (
                    <div style={{ marginLeft: 6 }}>
                      <p
                        style={{
                          fontWeight: 650,
                          marginBottom: 10,
                          fontSize: 16,
                        }}
                      >
                        Meal Preferences:
                      </p>
                      {Object.entries(party.mealPreferences).map(
                        ([guestName, prefs]) => (
                          <div
                            key={guestName}
                            style={{
                              marginLeft: 7,
                              marginBottom: 8,
                            }}
                          >
                            <p
                              style={{
                                margin: "2px 0",
                                fontSize: 16,
                                fontWeight: 550,
                              }}
                            >
                              {guestName}
                            </p>
                            <p
                              style={{
                                margin: "2px 0",
                                fontSize: 16,
                              }}
                            >
                              Entree: {prefs.entree || "Not specified"}
                              {getDescription(entreeOptions, prefs.entree) && (
                                <span
                                  style={{
                                    fontStyle: "italic",
                                    fontSize: 14,
                                    marginLeft: 6,
                                  }}
                                >
                                  {getDescription(entreeOptions, prefs.entree)}
                                </span>
                              )}
                            </p>
                            <p
                              style={{
                                margin: "2px 0",
                                fontSize: 16,
                              }}
                            >
                              Cake: {prefs.cake || "Not specified"}
                              {getDescription(cakeOptions, prefs.cake) && (
                                <span
                                  style={{
                                    fontStyle: "italic",
                                    fontSize: 14,
                                    marginLeft: 6,
                                  }}
                                >
                                  {getDescription(cakeOptions, prefs.cake)}
                                </span>
                              )}
                            </p>
                            {prefs.dietaryRestrictions && (
                              <p
                                style={{
                                  margin: "2px 0",
                                  fontSize: 16,
                                }}
                              >
                                Dietary Restrictions:{" "}
                                {prefs.dietaryRestrictions}
                              </p>
                            )}
                            {prefs.allergies && (
                              <p
                                style={{
                                  margin: "2px 0",
                                  fontSize: 16,
                                }}
                              >
                                Allergies: {prefs.allergies}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default CompleteRSVP;
