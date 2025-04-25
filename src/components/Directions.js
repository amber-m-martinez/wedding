import React from "react";
import "yet-another-react-lightbox/styles.css";
import ExpandableImage from "./ExpandableImage";

function Directions() {
  return (
    <div className="section-container">
      <div className="section-inner">
        <ExpandableImage
          src="/images/boathouse-event-map.png"
          alt="prospect park boathouse"
          className="section-image directions"
        />
        <div className="section-content">
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
            Please view the directions on this map, including the Uber/Lyft
            drop&#8209;off point and the pedestrian-only paths. You won't be
            able to drive directly up to the Boathouse. Staff from the Boathouse
            will be directing guests to the venue.
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
