import "/App.scss";
import BottomNav from "./components/navbar";
import Card from "./components/card";
import React, { useEffect, useState } from "react";
import { FaHome, FaSearch, FaUserAlt } from "react-icons/fa";
import useMode from './utils/state';
import LanguageSwitcher from './utils/i18n/LngSwitcher';
import { useTranslation } from 'react-i18next';
import { Link, Route, Routes } from "react-router-dom";
import Onas from "./pages1";
import Cart from "./pages2";

export default function App() {
  const [active, setActive] = useState("home");
  const handleNavClick = (nav) => {
    setActive(nav);
  }
  return (
    <>
     
      <div className='all  m-auto'>
        <div className="logo">
        <img src="/taste_transparent.png" alt="" />
           
      <LanguageSwitcher />

        </div>

        
        <Routes>
          <Route path="/" element={<Card/>}/>
          <Route path="/pages1" element={<Onas/>}/>
          <Route path="/pages2" element={<Cart/>}/>
        </Routes>

        <div className="bottom-nav m-auto ">
          
              <Link to="/"><div
            className={`nav-item ${active === "home" ? "active" : ""}`}
            onClick={() => handleNavClick("home")}
            >
            <i class="fa-solid fa-bars"></i>
            </div> </Link>
           
          
              <Link to={"/pages1"}><div
            className={`nav-item ${active === "search" ? "active" : ""}`}
            onClick={() => handleNavClick("search")}>
              {/* <FaSearch /> */}
              <FaHome />
          </div></Link>
            
         
              <Link to={"pages2"}>  <div
            className={`nav-item ${active === "profile" ? "active" : ""}`}
            onClick={() => handleNavClick("profile")}>        <i class="fa-solid fa-cart-shopping"></i>

          </div></Link>
           
        </div>
        
      </div>

    </>
  );
}
