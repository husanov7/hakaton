import "/App.scss";
import BottomNav from "./components/navbar";
import Card from "./components/card";
import React, { useState } from "react";
import { FaHome, FaSearch, FaUserAlt } from "react-icons/fa";
import useMode from './utils/state';
import LanguageSwitcher from './utils/i18n/LngSwitcher';
import { useTranslation } from 'react-i18next';

export default function App() {
  window.onload = function () {
    if (
      document.querySelectorAll(".progress").length > 0 &&
      document.querySelectorAll(".progress [data-progress]").length > 0
    ) {
      document
        .querySelectorAll(".progress [data-progress]")
        .forEach((x) => AnimateProgress(x));
    }
  };
  function AnimateProgress(el) {
    el.className = "animate-progress";
    el.setAttribute(
      "style",
      `--animate-progress:${el.getAttribute("data-progress")}%;`
    );
  }
  const { dark, changeMode } = useMode();
  const { t } = useTranslation();
  console.log(dark, 1)
  const [active, setActive] = useState("home");
  const handleNavClick = (nav) => {
    setActive(nav);
  }

  return (
    <>
      <LanguageSwitcher />
      <div className="all">
        {/* <div className="logo">
      <h1>logo</h1>
     </div>
     
     <div className="oll">
     <Card/> 
     </div>
      <BottomNav /> */}
        <h1 className="h1">logo</h1>

        <div className={`${dark ? "dark" : "cards"}`} >
          <div className="card">
            <img src="/salat_4.webp" alt="" />
            <h1>olivie</h1>
            <button>120000</button>
          </div>
          <div className="card">
            <img src="/salat_4.webp" alt="" />
            <h1>olivie</h1>
            <button>120000</button>
          </div>
          <div className="card">
            <img src="/salat_4.webp" alt="" />
            <h1>olivie</h1>
            <button>120000</button>
          </div>
          <div className="card">
            <img src="/salat_4.webp" alt="" />
            <h1>olivie</h1>
            <button>120000</button>
          </div>
          <div className="card">
            <img src="/salat_4.webp" alt="" />
            <h1>olivie</h1>
            <button>120000</button>
          </div>
          <div className="card">
            <img src="/salat_4.webp" alt="" />
            <h1>olivie</h1>
            <button>120000</button>
          </div>
          <div className="card">
            <img src="/salat_4.webp" alt="" />
            <h1>olivie</h1>
            <button>120000</button>
          </div>
          <div className="card">
            <img src="/salat_4.webp" alt="" />
            <h1>olivie</h1>
            <button>120000</button>
          </div>
        </div>

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
      </div>
    </>
  );
}
