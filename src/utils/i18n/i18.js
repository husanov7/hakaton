import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enAbout from "./translation/en/about";
import ruAbout from "./translation/ru/about";
import uzAbout from "./translation/uz/about";
import enBase from "./translation/en/korzina";
import ruBase from "./translation/ru/korzina";
import uzBase from "./translation/uz/korzina";
// ↓ TO'G'RI PATH
import enMenu from "./translation/en/menu";
import ruMenu from "./translation/ru/menu";
import uzMenu from "./translation/uz/menu";

const resources = {
  en: {
    about: enAbout,
    base: enBase,
    menu: enMenu,
  },
  ru: {
    about: ruAbout,
    base: ruBase,
    menu: ruMenu,
  },
  uz: {
    about: uzAbout,
    base: uzBase,
    menu: uzMenu,
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;