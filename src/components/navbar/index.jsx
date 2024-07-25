import "./navbar.scss";
import React, { useState } from "react";
import { FaHome, FaSearch, FaUserAlt } from "react-icons/fa";

const BottomNav = () => {
  const [active, setActive] = useState("home");

  const handleNavClick = (nav) => {
    setActive(nav);
  };

  return (
    <div className="bottom-nav">
      <div
        className={`nav-item ${active === "home" ? "active" : ""}`}
        onClick={() => handleNavClick("home")}
      >
        <FaHome />
      </div>
      <div
        className={`nav-item ${active === "search" ? "active" : ""}`}
        onClick={() => handleNavClick("search")}
      >
        <FaSearch />
      </div>
      <div
        className={`nav-item ${active === "profile" ? "active" : ""}`}
        onClick={() => handleNavClick("profile")}
      >
        <FaUserAlt />
      </div>
    </div>
  );
};

export default BottomNav;
