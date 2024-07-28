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
import { api } from "../../axios";

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

  const [menu, setMenu] = useState([])

  





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
          <img src="/photo/dish1.jpg" alt="salat" />
          <h1>Куриная Хашлама</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/photo/dish2.jpg" alt="salat" />
          <h1>Сужуклу Юмурта</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/photo/dish3.jpg" alt="salat" />
          <h1>Ассорти Донер</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/photo/dish4.jpg" alt="salat" />
          <h1>Мясной Искандер Кебаб</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/photo/dish5.jpg" alt="salat" />
          <h1>Ассорти Донер</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/photo/dish9.jpg" alt="salat" />
          <h1>Глазунья Из 2 Яиц</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/photo/dish6.jpg" alt="salat" />
          <h1>Омлет</h1>
          <button>120000</button>
        </div>
        <div className="card">
          <img src="/photo/dish8.jpg" alt="salat" />
          <h1>Кавурмали Юмурта</h1>
          <button>120000</button>
        </div>
        {/* Repeat other card components similarly */}
      </div>
    </>
  );
}
