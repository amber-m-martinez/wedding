import React, { useState } from "react";
import { motion } from "framer-motion";
import Masonry from "react-masonry-css";

function Attire() {
  const womensAttire = [
    "/images/womens-attire/womens-attire-5.jpeg",
    // "/images/womens-attire/womens-attire-2.jpeg",
    "/images/womens-attire/womens-attire-13.jpeg",
    "/images/womens-attire/womens-attire-4.jpeg",
    "/images/womens-attire/womens-attire-3.jpeg",

    "/images/womens-attire/womens-attire-1.jpeg",
    "/images/womens-attire/womens-attire-18.png",
    "/images/womens-attire/womens-attire-15.png",
    "/images/womens-attire/womens-attire-17.jpeg",
    "/images/womens-attire/womens-attire-16.png",
    "/images/womens-attire/womens-attire-10.jpeg",
  ];

  const mensAttire = [
    "/images/mens-attire/mens-attire-9.png",
    // "/images/mens-attire/mens-attire-7.jpeg",
    "/images/mens-attire/mens-attire-6.jpeg",
    "/images/mens-attire/mens-attire-8.jpeg",
    // "/images/mens-attire/mens-attire-4.jpeg",
    "/images/mens-attire/mens-attire-1.jpeg",
    "/images/mens-attire/mens-attire-3.jpeg",
    "/images/mens-attire/mens-attire-2.jpeg",
    "/images/mens-attire/mens-attire-5.jpeg",
    "/images/mens-attire/mens-attire-10.png",
  ];

  const breakpointColumnsObj = {
    default: 5,
    1100: 4,
    900: 3,
    600: 2,
    400: 1,
  };

  const [isWomensAttireOpen, setIsWomensAttireOpen] = useState(false);
  const [isMensAttireOpen, setIsMensAttireOpen] = useState(false);

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
      <div class="attire-container">
        <div style={{ marginBottom: 50 }}>
          <p className="responsive-align" style={{ fontSize: 28 }}>
            Wedding Day: Black-Tie Optional
          </p>
          <p
            className="responsive-align"
            style={{ fontSize: 18, marginTop: -10 }}
          >
            The attire for the wedding ceremony and reception is black-tie
            optional. You may see examples/inspiration for the attire below.
          </p>
        </div>
        <img
          src="/images/swans1.png"
          alt="swans"
          style={{ height: 35, marginBottom: 10 }}
        />
        <div
          className="inspo-header"
          onClick={() => setIsWomensAttireOpen(!isWomensAttireOpen)}
        >
          <p style={{ fontSize: 26 }}>
            Women's Attire Inspiration {isWomensAttireOpen ? "▴" : "▾"}
          </p>
        </div>
        <div
          className={`inspo-grid-wrapper ${isWomensAttireOpen ? "open" : ""}`}
          style={{
            maxHeight: isWomensAttireOpen ? "3000px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.6s ease-in-out",
          }}
        >
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {womensAttire.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`img-${idx}`}
                className="tile-img"
              />
            ))}
          </Masonry>
        </div>
        <div
          className="inspo-header"
          onClick={() => setIsMensAttireOpen(!isMensAttireOpen)}
        >
          <p style={{ fontSize: 26 }}>
            Men's Attire Inspiration {isMensAttireOpen ? "▴" : "▾"}
          </p>
        </div>
        <div
          className={`inspo-grid-wrapper ${isMensAttireOpen ? "open" : ""}`}
          style={{
            maxHeight: isMensAttireOpen ? "3000px" : "0px",
            overflow: "hidden",
            transition: "max-height 0.6s ease-in-out",
          }}
        >
          <Masonry
            breakpointCols={breakpointColumnsObj}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {mensAttire.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`img-${idx}`}
                className="tile-img"
              />
            ))}
          </Masonry>
        </div>
      </div>
    </motion.div>
  );
}
export default Attire;
