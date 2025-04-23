import { React } from "react";
import { motion } from "framer-motion";

function LoveStory() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "100vh",
        overflow: "hidden",
      }}
    >
      <div className="page-container">
        <div
          className="section-container"
          style={{ maxWidth: 880, width: "100%" }}
        >
          <div className="section-inner" style={{ width: 300 }}>
            <img
              src="/images/our-love-story/photobooth-strip-2.png"
              alt="photobooth-strip"
              style={{ width: 200 }}
            />
          </div>
          <div className="section-content" style={{ marginLeft: 0 }}>
            <p
              style={{
                fontFamily: "Cedarville cursive",
                fontSize: 35,
                marginTop: 100,
              }}
            >
              Our Love Story
            </p>
          </div>
        </div>

        <div
          className="section-container"
          style={{
            maxWidth: 880,
            width: "100%",
            marginTop: 30,
            alignItems: "center",
          }}
        >
          <div
            className="section-inner"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 100,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <img
              src="/images/our-love-story/first-date.png"
              alt="first date"
              style={{ width: 300, marginTop: 28, maxWidth: "100%" }}
            />
            <div className="section-content love-story">
              <p className="love-story-title">March 6th, 2021</p>
              <p
                style={{
                  fontSize: 20,
                  marginTop: 10,
                }}
              >
                Giddy and nervous, we met on March 6th, 2021 at Amoeba Music in
                San Francisco. Stephen was waiting with flowers; Amber came with
                cupcakes.
                <br />
                <br />
                We were both wearing masks (Covid), so neither of us could tell
                when the other was speaking because the music store was loud.
                Lol.
                <br />
                <br />
                We then walked to our favorite park, Golden Gate Park. Once we
                started talking, we couldn't stop. Instant sparks.
                <br />
                <br />
                It was their first time meeting, but Amber knew Stephen was the
                one. Listen to your heart!
              </p>
            </div>
          </div>
        </div>

        <div
          className="section-container"
          style={{
            maxWidth: 880,
            width: "100%",
            marginTop: 30,
            alignItems: "center",
          }}
        >
          <div
            className="section-inner"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-start",
              justifyContent: "center",
              gap: 100,
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <img
              src="/images/our-love-story/love-story-2.png"
              alt="photobooth-strip"
              style={{ width: 380, marginTop: 28, maxWidth: "100%" }}
            />
            <div className="section-content love-story">
              <p className="love-story-title">Our first year</p>
              <p
                style={{
                  fontSize: 20,
                  marginTop: 10,
                }}
              >
                Love blossomed. We became inseparable.
                <br />
                <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default LoveStory;
