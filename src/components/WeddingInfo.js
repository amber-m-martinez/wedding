import React from "react";

function WeddingInfo() {
  return (
    <div className="section-container">
      <div className="section-inner">
        <img
          src="/images/Boathouse_1.JPG"
          alt="prospect park boathouse"
          className="section-image"
          loading="eager"
        />
        <div className="section-content">
          <img
            style={{ height: 50 }}
            src="/images/swan-monogram-thin-grey.png"
            alt="swans"
          />
          <p className="section-title">Prospect Park Boathouse</p>

          <p className="section-paragraph" style={{ marginTop: -3 }}>
            <a href="/attire">Attire: Black-tie optional.</a>
          </p>
          <p className="section-time">5:00pm</p>
          <p className="section-subtitle" style={{ fontSize: 15 }}>
            Arrive by 5pm, the ceremony begins at 5:30pm.
          </p>
          <p className="section-detail">Ceremony outside by the Lullwater</p>
          <p className="section-time">6pm</p>
          <p className="section-detail">
            Drinks & hors d'oeuvres on the terrace
          </p>
          <p className="section-time">7pm</p>
          <p className="section-detail">Dinner inside the boathouse</p>
        </div>
      </div>
    </div>
  );
}

export default WeddingInfo;
