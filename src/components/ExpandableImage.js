import React from "react";
import Zoom from "react-medium-image-zoom";
import { FaExpandAlt } from "react-icons/fa";
import "react-medium-image-zoom/dist/styles.css";

const ExpandableImage = ({ src, alt, className = "" }) => {
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        cursor: "pointer", // Make the entire div clickable
      }}
    >
      <Zoom overlayBgColorEnd="rgba(255, 255, 255, 0.4)" zoomMargin={40}>
        <img
          src={src}
          alt={alt}
          className={className}
          style={{
            cursor: "pointer", // Ensure image also has pointer cursor
          }}
        />
      </Zoom>

      {/* Zoom icon overlay */}
      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          borderRadius: "999px",
          padding: "6px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          pointerEvents: "none", // makes sure clicks go through to image
        }}
      >
        <FaExpandAlt size={16} color="#333" />
      </div>
    </div>
  );
};

export default ExpandableImage;
