import React from "react";
import { motion } from "framer-motion";
import WeddingDayAttire from "./WeddingDayAttire";
import WelcomeDrinksAttire from "./WelcomeDrinksAttire";

function Attire() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "calc(100vh + 10px)",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      <WelcomeDrinksAttire />
      <WeddingDayAttire />
    </motion.div>
  );
}
export default Attire;
