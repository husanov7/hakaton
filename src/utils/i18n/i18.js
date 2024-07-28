import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enAbout from ".../../translation/en/about";
import ruAbout from ".../../translation/ru/about";
import uzAbout from ".../../translation/uz/about";

import about from "./translation/en/about";
// Sample translation resources
const resources = {
  en: {
   
    //  nom:"olive",
    about: enAbout,
  },
  ru: {
    translation: {
        narx:"1300",
        nom:"Оливье",
       tarkib:"",
       about:"",
    },
  },
  uz: {
    translation: {
        narx:"1400",
        nom:"oliviya",
       tarkib:"",
       about:"Biz haqimizda",
    },
  },
};

i18n
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources,
    lng: "en", // Default language
    interpolation: {
      escapeValue: false, // Not needed for React
    },
  });

export default i18n;