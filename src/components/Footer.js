import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function Footer() {
  const location = useLocation();

  const [isOnHomePage, setIsOnHomePage] = useState(location.pathname === "/");

  useEffect(() => {
    setIsOnHomePage(location.pathname === "/");
  }, [location.pathname]);

  return (
    <div className="footerContainer">
      {isOnHomePage ? null : (
        <p className="footerText">
          This website was built with love by Amber ♡
        </p>
      )}
    </div>
  );
}

export default Footer;
