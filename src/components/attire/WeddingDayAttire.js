import React, { useState } from "react";
import Masonry from "react-masonry-css";

function WeddingDayAttire() {
  const womensAttire = [
    "/images/womens-attire/womens-attire-5.jpeg",
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
    "/images/mens-attire/mens-attire-3.jpeg",
    "/images/mens-attire/mens-attire-9.png",
    "/images/mens-attire/mens-attire-1.jpeg",
    "/images/mens-attire/mens-attire-8.jpeg",
    "/images/mens-attire/mens-attire-2.jpeg",
    "/images/mens-attire/mens-attire-5.jpeg",
    "/images/mens-attire/mens-attire-11.jpeg",
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
    <div className="attire-container">
      <div style={{ marginBottom: 50, marginTop: 30 }}>
        <img
          src="/images/swan-monogram-thin-grey.png"
          alt="swans"
          className="swans-monogram"
          style={{ height: 50, marginBottom: 10 }}
        />
        <p
          className="responsive-align"
          style={{ fontSize: 25, fontWeight: 700 }}
        >
          Wedding Day: Black-Tie Optional
        </p>
        <p
          className="responsive-align"
          style={{ fontSize: 18, marginTop: -10 }}
        >
          The attire for the wedding ceremony and reception is Black-Tie
          Optional. Suits with ties, long dresses & gowns, and upscale pantsuits
          are perfect. Please avoid white. The flooring is herringbone brick, so
          thinner heels might be tricky.
          <br />
          You may see examples/inspiration for the attire below.
        </p>
      </div>
      <div
        className="inspo-header"
        onClick={() => setIsWomensAttireOpen(!isWomensAttireOpen)}
      >
        <p style={{ fontSize: 22 }}>
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
          style={{ marginBottom: 5 }}
        >
          {womensAttire.map((src, idx) => (
            <img key={idx} src={src} alt={`img-${idx}`} className="tile-img" />
          ))}
        </Masonry>
      </div>
      <div
        className="inspo-header"
        onClick={() => setIsMensAttireOpen(!isMensAttireOpen)}
      >
        <p style={{ fontSize: 22 }}>
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
            <img key={idx} src={src} alt={`img-${idx}`} className="tile-img" />
          ))}
        </Masonry>
      </div>
    </div>
  );
}
export default WeddingDayAttire;
