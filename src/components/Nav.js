import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

function Nav() {
  const location = useLocation();
  const [isOnHomePage, setIsOnHomePage] = useState(location.pathname === "/");
  const [currentPage, setCurrentPage] = useState("");

  useEffect(() => {
    setIsOnHomePage(location.pathname === "/");
    if (location.pathname === "/") {
      setCurrentPage("home");
    } else if (location.pathname === "/travel") {
      setCurrentPage("travel");
    } else if (location.pathname === "/attire") {
      setCurrentPage("attire");
    } else if (location.pathname === "/love-story") {
      setCurrentPage("our love story");
    } else if (location.pathname === "/events") {
      setCurrentPage("events");
    } else if (location.pathname === "/honored-guests") {
      setCurrentPage("honored guests");
    } else if (location.pathname === "/gifts") {
      setCurrentPage("gifts");
    } else if (location.pathname === "/FAQ") {
      setCurrentPage("FAQ");
    } else if (location.pathname === "/rsvp") {
      setCurrentPage("rsvp");
    }
  }, [location.pathname]);

  return (
    <div class="navBarContainer">
      <div>
        <p class="header">
          <a href="/" className="headerText">
            Amber & Stephen
          </a>
        </p>
      </div>
      <div className="navOptionsContainer">
        <a href="/love-story" class="navOptions">
          Our Love Story
        </a>
        <a href="/travel" class="navOptions">
          Travel
        </a>
        <a href="/events" class="navOptions">
          Events
        </a>
        <a href="/attire" class="navOptions">
          Attire
        </a>
        <a href="/faq" class="navOptions">
          FAQ
        </a>
        <a href="/gifts" class="navOptions">
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
            RSVP will be open around end of July
          </span>
        </div>
        <div className="navBottomBorder"></div>
      </div>
    </div>
  );
}

export default Nav;
