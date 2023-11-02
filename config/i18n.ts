import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: require("../assets/i18n/en.json"),
  },
  es: {
    translation: require("../assets/i18n/es.json"),
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"], // primero intenta obtener el idioma de localStorage, luego del navegador
      caches: ["localStorage"], // guarda el idioma seleccionado en localStorage
    },
  });

export default i18n;
