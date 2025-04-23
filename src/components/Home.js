import React from "react";
import { motion } from "framer-motion";

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div
        style={{
          marginTop: 12,
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
          width: "100vw",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <img
            src="/images/polaroids-shadow.png"
            className="homePhoto"
            alt="proposal"
            loading="eager"
          />
        </div>

        <div
          style={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            padding: "0 16px",
            fontFamily: "Cedarville cursive",
          }}
        >
          <img
            src="/images/swan-monogram-thin-grey.png"
            alt="swans"
            className="swan-home"
          />
          <p
            style={{
              fontSize: 25,
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            Friday October 24th, 2025
          </p>
          <p
            style={{
              fontSize: 21,
              marginBottom: 10,
            }}
          >
            at the
          </p>
          <p
            style={{
              fontSize: 25,
              textAlign: "center",
              letterSpacing: 1,
              marginBottom: 20,
            }}
          >
            Prospect Park Boathouse
            <span
              style={{
                fontSize: 21,
                textAlign: "center",
                display: "block",
                marginTop: 3,
              }}
            >
              Brooklyn, New York
            </span>
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default Home;
