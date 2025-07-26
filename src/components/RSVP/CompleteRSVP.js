import { motion } from "framer-motion";
import { useState } from "react";
import { useScrollToHeader } from "./rsvp-utils";

function CompleteRSVP({ guestRSVP }) {
  useScrollToHeader(60);

  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Check if any guest is attending any event
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

  const sendConfirmationEmail = async () => {
    // Prompt user for email if not already collected
    const email = prompt(
      "Please enter your email address for the confirmation:"
    );

    if (!email) {
      alert("Email address is required to send confirmation.");
      return;
    }

    setSendingEmail(true);

    try {
      console.log("Sending email to:", email);
      console.log("RSVP data:", guestRSVP);

      const response = await fetch("/api/send-rsvp-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: email,
          rsvpData: guestRSVP,
        }),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      const result = await response.json();
      console.log("Response result:", result);

      if (response.ok && result.success) {
        setEmailSent(true);
      } else {
        throw new Error(result.message || "Failed to send email");
      }
    } catch (error) {
      console.error("Full error details:", error);

      // More detailed error message
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        alert(
          "Cannot connect to server. Please check if the server is running."
        );
      } else if (error.message.includes("404")) {
        alert(
          "Email endpoint not found. The server may not have the email functionality set up yet."
        );
      } else {
        alert(
          `Error sending email: ${error.message}. Please save this page or take a screenshot for your records.`
        );
      }
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

        {/* RSVP Summary Display */}
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

                {Object.keys(party.mealPreferences).length > 0 && (
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
                              Dietary Restrictions: {prefs.dietaryRestrictions}
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

        {/* Email Confirmation Section */}
        <div style={{ textAlign: "center" }}>
          {!emailSent ? (
            <button
              onClick={sendConfirmationEmail}
              disabled={sendingEmail}
              style={{
                backgroundColor: "#2d5016",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: 6,
                fontSize: 16,
                cursor: sendingEmail ? "not-allowed" : "pointer",
                opacity: sendingEmail ? 0.6 : 1,
              }}
            >
              {sendingEmail ? "Sending..." : "Email Me a Confirmation"}
            </button>
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
