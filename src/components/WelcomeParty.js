import React from "react";

function WelcomeParty() {
  return (
    <div className="section-container">
      <div className="section-inner">
        <img
          src="/images/clover-club.png"
          alt="clover-club"
          className="section-image"
          loading="eager"
          style={{ objectFit: "cover", objectPosition: "center 65%" }}
        />
        <div className="section-content">
          <img
            style={{ height: 50 }}
            src="/images/swan-monogram-thin-grey.png"
            alt="swans"
          />
          <p className="section-title">Clover Club</p>
          <p className="section-subtitle">
            <a
              href="https://maps.app.goo.gl/swFgyYSkyL5UdSKWA"
              target="_blank"
              rel="noopener noreferrer"
            >
              210 Smith St, Brooklyn, NY 11201
            </a>
          </p>

          <p className="section-paragraph" style={{ marginTop: -3 }}>
            <a href="/attire">Attire: Smart Casual.</a>
          </p>
          <p className="section-time">6-8pm</p>
          <p className="section-detail">Drinks and mingling</p>
        </div>
      </div>
    </div>
  );
}

export default WelcomeParty;
