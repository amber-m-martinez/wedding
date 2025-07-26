import { motion } from "framer-motion";
import { useScrollToHeader } from "./rsvp-utils";

function CompleteRSVP({ guestRSVP }) {
  useScrollToHeader(60);

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
      </div>
    </motion.div>
  );
}

export default CompleteRSVP;
