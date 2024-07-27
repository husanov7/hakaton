import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Sample translation resources
const resources = {
  en: {
    translation: {
     narx:"",
     nom:"",
    tarkib:"",
    about:"About US"
    },
  },
  ru: {
    translation: {
        narx:"1300",
        nom:"",
       tarkib:"",
       about:"",
    },
  },
  uz: {
    translation: {
        narx:"1400",
        nom:"",
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