import React from "react";
import "yet-another-react-lightbox/styles.css";
import ExpandableImage from "./ExpandableImage";
// import "yet-another-react-lightbox/plugins/zoom/styles.css";

function Directions() {
  return (
    <div className="section-container">
      <div className="section-inner">
        {/* <img
          src="/images/boathouse-event-map.png"
          alt="prospect park boathouse"
          className="section-image"
        /> */}

        <ExpandableImage
          src="/images/boathouse-event-map.png"
          alt="prospect park boathouse"
          className="section-image"
        />
        <div className="section-content">
          {/* <img src="/images/swans1.png" alt="swans" /> */}
          <p className="section-title">Directions</p>
          <p className="section-subtitle">
            <a
              href="https://maps.app.goo.gl/iGexChb4n3WyuamP7"
              target="_blank"
              rel="noopener noreferrer"
            >
              101 East Dr, Brooklyn, NY 11225
            </a>
          </p>
          <p className="section-paragraph">
            Staff from the boathouse will be directing guests to the venue.
          </p>
          <p className="section-paragraph">
            Parking is available along Willink Drive as shown on the map, but
            please do not drive if you will be drinking (it'll be open bar).
          </p>
        </div>
      </div>
    </div>
  );
}

export default Directions;
