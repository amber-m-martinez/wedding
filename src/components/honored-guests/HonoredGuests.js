import React from "react";
import { motion } from "framer-motion";
import GuestCard from "./GuestCard";
import guestsData from "../../api/honored-guests.json";

function HonoredGuests() {
  const honoredGuests = guestsData.guests;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "calc(100vh)",
        width: "100vw",
        backgroundSize: "100% auto",
        backgroundPosition: "center 10%",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f9f2ef",
        overflow: "hidden",
      }}
    >
      <div style={{ marginTop: 120 }}>
        <div
          style={{
            maxWidth: 1500,
            marginLeft: "auto",
            marginRight: "auto",
            padding: "0 20px",
          }}
        >
          <h3
            style={{
              display: "block",
              textAlign: "left",
              fontFamily: "EB Garamond",
              fontWeight: 200,
              fontSize: 35,
            }}
          >
            <i>Wedding Party</i>
          </h3>
        </div>
        <div
          style={{
            marginTop: 50,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", // This creates a responsive grid layout
            gap: 20,
            justifyItems: "center", // Ensure each grid item (GuestCard) is centered
            maxWidth: 1500,
            marginLeft: "auto",
            marginRight: "auto",
            padding: "0 20px",
          }}
        >
          {honoredGuests.map((guest, index) => (
            <GuestCard key={index} data={guest} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default HonoredGuests;
