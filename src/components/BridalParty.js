import React from "react";
import { motion } from "framer-motion";

function BridalParty() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        width: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: 30,
      }}
    >
      <img
        src="/images/bridal-party-info/bridal-party-dresses.png"
        alt="bridal party attire"
        style={{ width: 880 }}
      ></img>
    </motion.div>
  );
}

export default BridalParty;
