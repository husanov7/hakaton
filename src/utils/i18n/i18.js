import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enAbout from ".../../translation/en/about";
import ruAbout from ".../../translation/ru/about";
import uzAbout from ".../../translation/uz/about";
import enBase from ".../../translation/en/korzina";
import ruBase from ".../../translation/ru/korzina";
import uzBase from ".../../translation/uz/korzina";

// Sample translation resources
const resources = {
  en: {
    about: enAbout,
    base: enBase,
  },
  ru: {
    about: ruAbout,
    base: ruBase,

  },
  uz: {
    about: uzAbout,
    base: uzBase,

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