import "/App.scss";
import BottomNav from "./components/navbar";
import React, { useState } from "react";
import { FaHome } from "react-icons/fa";
import useMode from './utils/state'; 
import LanguageSwitcher from './utils/i18n/LngSwitcher';
import { Link, Route, Routes, useLocation } from "react-router-dom";
import OrderHistory from "./pages/pages1";
import Cart from "./pages/pages2";
import Home from "./pages/landing";
import Kassa from "./components/Kassa/Kassa";

// Routes ichida:
<Route path="/order-history" element={<OrderHistory />} />
export default function App() {
  // const location = useLocation();
  
  const path = location.pathname;

  return (
    <div className='all m-auto'>
      

      <Routes>
        <Route path="/kassa" element={<Kassa />} />
        <Route path="/" element={<Home />} />
        {/* <Route path="/pages1" element={<Onas />} /> */}
        <Route path="/pages2" element={<Cart />} />
        <Route path="/pages1" element={<OrderHistory />} />

      </Routes>

      <div className="bottom-nav m-auto">
  <Link to="/">
    <div className={`nav-item ${path === "/" ? "active" : ""}`}>
      <i className="fa-solid fa-bars"></i>
    </div>
  </Link>

  <Link to="/pages1">
    <div className={`nav-item ${path === "/pages1" ? "active" : ""}`}>
      <FaHome />
    </div>
  </Link>

  <Link to="/pages2">
    <div className={`nav-item ${path === "/pages2" ? "active" : ""}`}>
      <i className="fa-solid fa-cart-shopping"></i>
    </div>
  </Link>
</div>
    </div>
  );
}
