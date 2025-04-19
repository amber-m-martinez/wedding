import React from "react";
import { motion } from "framer-motion";

function Gifts() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: "calc(100vh)",
        width: "100vw",
      }}
    >
      <div className="page-container" style={{ maxWidth: 780 }}>
        <h2 style={{ fontWeight: 600, textAlign: "center" }}>
          We're accepting funds for our Honeymoon!
        </h2>
        <p style={{ fontSize: 18, marginBottom: 40, textAlign: "center" }}>
          We’re lucky to already have everything we need for our home, so
          instead of traditional gifts, we’ve put together a few ways you can
          contribute to experiences — like our honeymoon and mini-moon — over on
          our Zola registry. Click the link below to see the full list 💞
        </p>
        <a
          href="https://www.zola.com/registry/amberandstephen1024"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textAlign: "center" }}
        >
          <img
            src="https://d1tntvpcrzvon2.cloudfront.net/static-assets/images/logos/zola-logomark-marine.svg"
            alt="View our registry on Zola"
            style={{ width: 180 }}
          ></img>
        </a>
        <a
          href="https://www.zola.com/registry/amberandstephen1024"
          target="_blank"
          rel="noopener noreferrer"
          style={{ textAlign: "center", marginTop: 11 }}
        >
          <button>
            <p className="button-link honeymoon">
              View Our Zola Wedding Registry
            </p>
          </button>
        </a>
      </div>
    </motion.div>
  );
}

export default Gifts;
