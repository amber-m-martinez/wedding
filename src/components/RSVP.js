import React from "react";
import { motion } from "framer-motion";

function RSVP() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "calc(100vh + 400px)",
        width: "100vw",
      }}
    ></motion.div>
  );
}

export default RSVP;
