import { Option, Select } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./style.scss";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const [lang, setLang] = useState(localStorage.getItem("language") || "ru");

  useEffect(() => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  }, [lang]);

  const handleLanguageChange = (value) => {
    setLang(value); // state yangilanadi → select qayta render bo‘ladi
  };

  return (
    <div className="select">
      <Select
        onChange={(val) => handleLanguageChange(val)}
        value={lang}
        className="sel"
        label={"Select Language"}
      >
        <Option className="opt" value="uz">
          <img
            src="https://alchiroq.uz/_nuxt/img/flag-uz.7f05fea.svg"
            alt=""
            className="img"
          />
          UZ
        </Option>

        <Option className="opt" value="en">
          <img
            src="https://alchiroq.uz/_nuxt/img/flag-en.0c98644.svg"
            alt=""
            className="img"
          />
          EN
        </Option>

        <Option className="opt" value="ru">
          <img
            src="data:image/svg+xml;base64,PHN2ZyB3aWR0..."
            alt=""
            className="img"
          />
          RU
        </Option>
      </Select>
    </div>
  );
}

export default LanguageSwitcher;
