// import LanguageSwitcher from "../../utils/i18n/LngSwitcher";
// import "./style.scss"; // Ensure this is correctly pointing to your stylesheet
// import useMode from "../../utils/state";
// import { useTranslation } from 'react-i18next';
// import { useEffect, useState } from "react";
// export default function Card() {
//   window.onload = function () {
//     if (
//       document.querySelectorAll(".progress").length > 0 &&
//       document.querySelectorAll(".progress [data-progress]").length > 0
//     ) {
//       document
//         .querySelectorAll(".progress [data-progress]")
//         .forEach((x) => AnimateProgress(x));
//     }
//   };
  
//   const { dark, changeMode } = useMode();
//   const { t } = useTranslation();
//   console.log(dark, 1)
//   const [active, setActive] = useState("home");
//   const handleNavClick = (nav) => {
//     setActive(nav);
//   }

//   const { i18n } = useTranslation();

//   const lang = localStorage.getItem("language");

//   useEffect(() => {
//     if (!lang) {
//       localStorage.setItem("language", "ru");
//     }
//   }, []);

//   const handleLanguageChange = (event) => {
//     const selectedLanguage = event.target.value;
//     localStorage.setItem("language", selectedLanguage);
//     i18n.changeLanguage(selectedLanguage);
//   };
//   return (
//     <>
//           <LanguageSwitcher />

//       <div className={`${dark ? "dark" : "cards"}`}>
      

//         <div className="card">
//           <img src="/salat_4.webp" alt="" />
//           <h1>{t("nom")}</h1>
//           <button>120000</button>
//         </div> 
//         <div className="card">
//           <img src="/salat_4.webp" alt="" />
//           <h1>olivie</h1>
//           <button>120000</button>
//         </div>
//         <div className="card">
//           <img src="/salat_4.webp" alt="" />
//           <h1>olivie</h1>
//           <button>120000</button>
//         </div>
//         <div className="card">
//           <img src="/salat_4.webp" alt="" />
//           <h1>olivie</h1>
//           <button>120000</button>
//         </div>
//         <div className="card">
//           <img src="/salat_4.webp" alt="" />
//           <h1>olivie</h1>
//           <button>120000</button>
//         </div>
//         <div className="card">
//           <img src="/salat_4.webp" alt="" />
//           <h1>olivie</h1>
//           <button>120000</button>
//         </div>
//         <div className="card">
//           <img src="/salat_4.webp" alt="" />
//           <h1>olivie</h1>
//           <button>120000</button>
//         </div>
//         <div className="card">
//           <img src="/salat_4.webp" alt="" />
//           <h1>olivie</h1>
//           <button>120000</button>
//         </div>
//       </div>
     
//     </>
//   );
// }

import LanguageSwitcher from "../../utils/i18n/LngSwitcher";
import "./style.scss"; // Ensure this is correctly pointing to your stylesheet
import useMode from "../../utils/state";
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

export default function Card() {
  useEffect(() => {
    if (
      document.querySelectorAll(".progress").length > 0 &&
      document.querySelectorAll(".progress [data-progress]").length > 0
    ) {
      document
        .querySelectorAll(".progress [data-progress]")
        .forEach((x) => AnimateProgress(x));
    }
  }, []); // Empty dependency array to run only once

  const { t, i18n } = useTranslation();

  const [active, setActive] = useState("home");
  const handleNavClick = (nav) => {
    setActive(nav);
  };

  const lang = localStorage.getItem("language");

  

 

  return (
    <>
      <div className="prod">
      
  <nav>
    <ul >
    <li><a href="#appetizers">Appetizers</a></li>
      <li><a href="#main-courses">Main Courses</a></li>
      <li><a href="#desserts">Desserts</a></li>
      <li><a href="#drinks">Drinks</a></li>   
       <li><a href="#appetizers">Appetizers</a></li>
      <li><a href="#main-courses">Main Courses</a></li>
      <li><a href="#desserts">Desserts</a></li>
      <li><a href="#drinks">Drinks</a></li> 
      <li><a href="#appetizers">Appetizers</a></li>
      <li><a href="#main-courses">Main Courses</a></li>
      <li><a href="#desserts">Desserts</a></li>
      <li><a href="#drinks">Drinks</a></li>   
    </ul>   

  </nav>
  <section id="appetizers">
    </section>
  <footer>
    </footer>
      </div>
      <div className='cards'>
        <div className="card ">
          <img src="/salat_4.webp" alt="salat" />
          <h1>{t("nom")}</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/salat_4.webp" alt="salat" />
          <h1>{t("nom")}</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/salat_4.webp" alt="salat" />
          <h1>{t("nom")}</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/salat_4.webp" alt="salat" />
          <h1>{t("nom")}</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/salat_4.webp" alt="salat" />
          <h1>{t("nom")}</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/salat_4.webp" alt="salat" />
          <h1>{t("nom")}</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/salat_4.webp" alt="salat" />
          <h1>{t("nom")}</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/salat_4.webp" alt="salat" />
          <h1>{t("nom")}</h1>
          <button>120000</button>
        </div>
        {/* Repeat other card components similarly */}
      </div>
    </>
  );
}
