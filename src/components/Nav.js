import React from "react";

function Nav() {
  return (
    <div className="navBarContainer">
      <div>
        <p className="header">
          <a href="/" className="headerText">
            Amber & Stephen
          </a>
        </p>
      </div>
      <div className="navOptionsContainer">
        <a href="/love-story" className="navOptions">
          Our Love Story
        </a>
        <a href="/travel" className="navOptions">
          Travel
        </a>
        <a href="/events" className="navOptions">
          Events
        </a>
        <a href="/attire" className="navOptions">
          Attire
        </a>
        <a href="/faq" className="navOptions">
          FAQ
        </a>
        <a href="/gifts" className="navOptions">
          Registry
        </a>
        <div className="tooltip-wrapper">
          <a
            href="/"
            className="navOptions disabled-link"
            onClick={(e) => e.preventDefault()}
          >
            RSVP
          </a>
          <span className="tooltip-text">
            RSVP will open around end of July
          </span>
        </div>
        <div className="navBottomBorder"></div>
      </div>
    </div>
  );
}

export default Nav;
