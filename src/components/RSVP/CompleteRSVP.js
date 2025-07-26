import { motion } from "framer-motion";

function CompleteRSVP({ guestRSVP }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        width: "100vw",
      }}
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
            We look forward to celebrating with you!
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default CompleteRSVP;
