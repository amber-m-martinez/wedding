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
        marginBottom: 50,
      }}
    >
      <div className="page-container">
        <div
          className="section-container"
          style={{ maxWidth: 880, width: "100%" }}
        >
          <div className="section-inner love-story" style={{ width: 300 }}>
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
            className="section-inner love-story"
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
              style={{ width: 320, marginTop: 28, maxWidth: "100%" }}
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
                San Francisco. Stephen was waiting with flowers–ivory
                ranunculuses; Amber came with oreo cheesecake cupcakes.
                <br />
                <br />
                Inside the store, we were both wearing masks (Covid), and
                neither of us could tell when the other was speaking. It was
                pretty loud in Amoeba. Lol. It was awkward.
                <br />
                <br />
                We then walked to the Conservatory of Flowers in our favorite
                park, Golden Gate Park, to have a picnic with wine and cupcakes.
                Once we started talking, we couldn't stop. Instant sparks.
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
            className="section-inner love-story"
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
              src="/images/our-love-story/love-story-2-v2.png"
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
                Love blossomed. We became inseparable. Stephen wrote love notes
                on stickies, while Amber wrote love poems. There wasn't a day
                that Amber went without bouquets of flowers in her room from
                Stephen.
                <br />
                <br />
                During this year, we took our first trip together to Mexico, met
                each other's families, and moved into our first apartment
                together in the Castro, San Francisco.
                <br />
                <br />
                Falling in love with each other was beautiful, uncontrollable,
                and pure fate.
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
            className="section-inner love-story"
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
              src="/images/our-love-story/love-story-3.png"
              alt="first date"
              style={{ width: 350, marginTop: 28, maxWidth: "100%" }}
            />
            <div className="section-content love-story">
              <p className="love-story-title">Three years</p>
              <p
                style={{
                  fontSize: 20,
                  marginTop: 10,
                }}
              >
                On our third anniversary, Stephen proposed in the park where we
                met. It was a tradition of ours to go to Golden Gate Park on
                March 6th. That year, we had planned a picnic in Shakespeare's
                Garden.
                <br />
                <br />
                It was cloudy and rainy all day until we got to the park that
                afternoon. Stephen suggested they take a photo together, then
                dropped down on one knee. The sun was shining and we poured our
                hearts out to each other.
                <br />
                <br />
                That night, we celebrated at Cotogna, an Italian restaurant in
                San Francisco. The next morning, we left for a weekend trip to
                our favorite getaway spot, Carmel, and at our favorite inn,
                Tickle Pink Inn. It was a magical weekend full of love. ♡
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
            className="section-inner love-story"
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
              src="/images/our-love-story/love-story-4.png"
              alt="photobooth-strip"
              style={{ width: 380, marginTop: 28, maxWidth: "100%" }}
            />
            <div className="section-content love-story">
              <p className="love-story-title">Today</p>
              <p
                style={{
                  fontSize: 20,
                  marginTop: 10,
                }}
              >
                Stephen and Amber are now living in a brownstone in Prospect
                Heights, Brooklyn. They're enjoying seasons, the engaged life,
                and are building on the future of their marriage. Also, lots and
                lots of wedding planning!
                <br />
                <br />
                We hope to celebrate our union with you and share our love even
                further. Meet us in Brooklyn in October ♡
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
