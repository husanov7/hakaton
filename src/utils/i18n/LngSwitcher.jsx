import { Option, Select } from "@material-tailwind/react";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import './style.scss'

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const lang = localStorage.getItem("language");

  useEffect(() => {
    if (!lang) {
      localStorage.setItem("language", "ru");
    }
  }, []);

  const handleLanguageChange = (value) => {
    const selectedLanguage = value;
    console.log(value);
    localStorage.setItem("language", selectedLanguage);
    i18n.changeLanguage(selectedLanguage);
  };
  console.log();

  return (
    <div className="select">
          <Select
            onChange={(val) => handleLanguageChange(val)}
            value={lang}
            className="sel"
            label={'Select Language'}
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
                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPG1hc2sgaWQ9Im1hc2swXzI1OV8xMzUxIiBzdHlsZT0ibWFzay10eXBlOmx1bWluYW5jZSIgbWFza1VuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0IiBoZWlnaHQ9IjI0Ij4KPHBhdGggZD0iTTEyIDI0QzE4LjYyNzQgMjQgMjQgMTguNjI3NCAyNCAxMkMyNCA1LjM3MjU4IDE4LjYyNzQgMCAxMiAwQzUuMzcyNTggMCAwIDUuMzcyNTggMCAxMkMwIDE4LjYyNzQgNS4zNzI1OCAyNCAxMiAyNFoiIGZpbGw9IndoaXRlIi8+CjwvbWFzaz4KPGcgbWFzaz0idXJsKCNtYXNrMF8yNTlfMTM1MSkiPgo8cGF0aCBkPSJNMCA3LjgyODEyTDExLjg5NjkgNi45MjM0M0wyNCA3LjgyODEyVjE2LjE3MTlMMTIuMDUxNiAxNy42ODU5TDAgMTYuMTcxOVY3LjgyODEyWiIgZmlsbD0iIzAwNTJCNCIvPgo8cGF0aCBkPSJNMCAwSDI0VjcuODI4MTJIMFYwWiIgZmlsbD0iI0VFRUVFRSIvPgo8cGF0aCBkPSJNMCAxNi4xNzE5SDI0VjI0SDBWMTYuMTcxOVoiIGZpbGw9IiNEODAwMjciLz4KPC9nPgo8L3N2Zz4K"
                alt=""
                className="img"
              />
              RU{" "}
            </Option>
          </Select>
        </div>
  );
}

export default LanguageSwitcher;