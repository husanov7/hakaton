import "/App.scss";
import BottomNav from "./components/navbar";
import Card from "./components/card";
import React, { useState } from "react";
import { FaHome, FaSearch, FaUserAlt } from "react-icons/fa";

export default function App() {
  const [active, setActive] = useState("home");

  const handleNavClick = (nav) => {
    setActive(nav);}
  return (
   <>
    <div className="all">
     {/* <div className="logo">
      <h1>logo</h1>
     </div>
     
     <div className="oll">
     <Card/> 
     </div>
      <BottomNav /> */}
      <h1 className="h1">logo</h1>

<div className="cards">
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
