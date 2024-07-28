import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { ThemeProvider } from "@material-tailwind/react";
import { I18nextProvider } from "react-i18next";
import i18n from "./utils/i18n/i18";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
    <ThemeProvider>
    <I18nextProvider i18n={i18n}>
      <App />
    </I18nextProvider>
    </ThemeProvider>
    </BrowserRouter>
);
