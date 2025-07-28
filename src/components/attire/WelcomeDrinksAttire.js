import React, { useState } from "react";
import Masonry from "react-masonry-css";

function WelcomeDrinksAttire() {
  const womensAttire = [
    "/images/womens-attire/welcome-drinks/women-drinks-14.jpeg",
    "/images/womens-attire/welcome-drinks/women-drinks-19.jpeg",
    "/images/womens-attire/welcome-drinks/women-drinks-23.png",
    "/images/womens-attire/welcome-drinks/women-drinks-15.jpeg",
    "/images/womens-attire/welcome-drinks/women-drinks-25.jpeg",
    "/images/womens-attire/welcome-drinks/women-drinks-16.jpeg",
    "/images/womens-attire/welcome-drinks/women-drinks-25.jpg",
    "/images/womens-attire/welcome-drinks/women-drinks-28.png",
    "/images/womens-attire/welcome-drinks/women-drinks-31.jpeg",
    "/images/womens-attire/welcome-drinks/women-drinks-32.png",
  ];

  const mensAttire = [
    "/images/mens-attire/welcome-drinks/men-drinks-15.jpeg",
    "/images/mens-attire/welcome-drinks/men-drinks-17.jpeg",
    "/images/mens-attire/welcome-drinks/men-drinks-16.jpeg",
    "/images/mens-attire/welcome-drinks/men-drinks-19.jpeg",
    "/images/mens-attire/welcome-drinks/men-drinks-9.jpeg",
    "/images/mens-attire/welcome-drinks/men-drinks-8.jpeg",
    "/images/mens-attire/welcome-drinks/men-drinks-18.jpeg",
    "/images/mens-attire/welcome-drinks/men-drinks-20.jpeg",
    "/images/mens-attire/welcome-drinks/men-drinks-5.jpeg",
    "/images/mens-attire/welcome-drinks/men-drinks-21.jpeg",
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
      <div style={{ marginBottom: 50 }}>
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
          Welcome Party: Elevated Smart Casual
        </p>
        <p
          className="responsive-align"
          style={{ fontSize: 18, marginTop: -10 }}
        >
          The welcome party attire is Elevated Smart Casual. Dressy but relaxed!
          Think trousers or chinos with a nice shirt or sweater, and stylish
          dresses, skirts, or polished pants. Jackets and ties are not required.
          Please no jeans or athletic shoes. <br />
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
export default WelcomeDrinksAttire;
