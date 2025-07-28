import React from "react";
import { motion } from "framer-motion";
import WeddingInfo from "./WeddingInfo";
import Directions from "./Directions";
import WelcomeParty from "./WelcomeParty";

function Events() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        width: "100vw",
        overflow: "hidden",
        marginBottom: 50,
      }}
    >
      <div className="page-container">
        <div style={{ maxWidth: 900, width: "100%" }}>
          <p className="eventName">
            <span className="desktop-only">
              Welcome Party – Thursday, October 23rd, 2025
            </span>
            <span className="mobile-only">
              Welcome Party
              <br />
              Thursday, October 23rd, 2025
            </span>
          </p>
          <div className="dottedBorder"></div>
          <WelcomeParty />
        </div>

        <div style={{ maxWidth: 900, width: "100%" }}>
          <p className="eventName">
            <span className="desktop-only">
              Wedding Day – Friday, October 24th, 2025
            </span>
            <span className="mobile-only">
              Wedding Day
              <br />
              Friday, October 24th, 2025
            </span>
          </p>
          <div className="dottedBorder"></div>
          <WeddingInfo />
          <div style={{ margin: 60 }} />
          <Directions />
        </div>
      </div>
    </motion.div>
  );
}

export default Events;
