import { motion } from "framer-motion";
import { useState } from "react";
import { useScrollToHeader } from "./rsvp-utils";

function CompleteRSVP({ guestRSVP }) {
  useScrollToHeader(60);

  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);

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
      <div className="page-container rsvp">
        <div
          style={{
            textAlign: "center",
            padding: "20px",
            backgroundColor: "#e8f5e8",
            border: "1px solid #c3e6c3",
            borderRadius: 8,
            marginBottom: 40,
          }}
        >
          <h5 style={{ marginBottom: 10, color: "#2d5016" }}>
            RSVP Successfully Submitted!
          </h5>
          <p style={{ fontSize: 16, color: "#2d5016", margin: 0 }}>
            {anyoneAttending
              ? "We look forward to celebrating with you!"
              : "Thank you for letting us know!"}
          </p>
        </div>

        {anyoneAttending && (
          <div
            style={{
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              borderRadius: 8,
              padding: "20px",
              marginBottom: 20,
            }}
          >
            <h6 style={{ marginBottom: 15, color: "#333" }}>
              Your RSVP Summary:
            </h6>

            <div style={{ marginBottom: 15 }}>
              <strong>Event Attendance:</strong>
              <p style={{ margin: "5px 0" }}>
                Wedding Day: {rsvpSummary.totalWeddingDay} guest(s)
              </p>
              <p style={{ margin: "5px 0" }}>
                Welcome Party: {rsvpSummary.totalWelcomeParty} guest(s)
              </p>
            </div>

            {rsvpSummary.parties.map((party, partyIndex) => (
              <div key={partyIndex} style={{ marginBottom: 20 }}>
                <div style={{ marginBottom: 15 }}>
                  <strong>{party.name}:</strong>
                  {party.guests.map((guest, guestIndex) => (
                    <div
                      key={guestIndex}
                      style={{ marginLeft: 10, marginBottom: 8 }}
                    >
                      <p style={{ margin: "2px 0", fontWeight: "500" }}>
                        {guest.name}
                      </p>
                      <p
                        style={{ margin: "2px 0", fontSize: 14, color: "#666" }}
                      >
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
                    <div style={{ marginLeft: 10 }}>
                      <strong>Meal Preferences:</strong>
                      {Object.entries(party.mealPreferences).map(
                        ([guestName, prefs]) => (
                          <div
                            key={guestName}
                            style={{ marginLeft: 10, marginBottom: 8 }}
                          >
                            <p style={{ margin: "2px 0", fontWeight: "500" }}>
                              {guestName}
                            </p>
                            <p
                              style={{
                                margin: "2px 0",
                                fontSize: 14,
                                color: "#666",
                              }}
                            >
                              Entree: {prefs.entree || "Not specified"}
                            </p>
                            <p
                              style={{
                                margin: "2px 0",
                                fontSize: 14,
                                color: "#666",
                              }}
                            >
                              Cake: {prefs.cake || "Not specified"}
                            </p>
                            {prefs.dietaryRestrictions && (
                              <p
                                style={{
                                  margin: "2px 0",
                                  fontSize: 14,
                                  color: "#666",
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
                                  fontSize: 14,
                                  color: "#666",
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
          </div>
        )}

        <div style={{ textAlign: "center" }}>
          {!emailSent ? (
            <>
              {!showEmailInput ? (
                <button
                  onClick={handleEmailButtonClick}
                  style={{
                    backgroundColor: "#2d5016",
                    color: "white",
                    border: "none",
                    padding: "12px 24px",
                    borderRadius: 6,
                    fontSize: 16,
                    cursor: "pointer",
                  }}
                >
                  Email Me a Confirmation
                </button>
              ) : (
                <form
                  onSubmit={handleEmailSubmit}
                  style={{ display: "inline-block" }}
                >
                  <div style={{ marginBottom: 10 }}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      style={{
                        padding: "8px 12px",
                        borderRadius: 4,
                        border: "1px solid #ccc",
                        fontSize: 14,
                        width: "250px",
                        marginRight: 10,
                      }}
                    />
                  </div>
                  <div>
                    <button
                      type="submit"
                      disabled={sendingEmail}
                      style={{
                        backgroundColor: "#2d5016",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 4,
                        fontSize: 14,
                        cursor: sendingEmail ? "not-allowed" : "pointer",
                        opacity: sendingEmail ? 0.6 : 1,
                        marginRight: 8,
                      }}
                    >
                      {sendingEmail ? "Sending..." : "Send"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowEmailInput(false)}
                      disabled={sendingEmail}
                      style={{
                        backgroundColor: "#6c757d",
                        color: "white",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: 4,
                        fontSize: 14,
                        cursor: sendingEmail ? "not-allowed" : "pointer",
                        opacity: sendingEmail ? 0.6 : 1,
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </>
          ) : (
            <div
              style={{
                padding: "12px",
                backgroundColor: "#d4edda",
                border: "1px solid #c3e6cb",
                borderRadius: 6,
                color: "#155724",
              }}
            >
              ✓ Confirmation email sent successfully!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default CompleteRSVP;
