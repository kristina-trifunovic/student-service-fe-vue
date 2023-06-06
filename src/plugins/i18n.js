import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import rs from "@/locales/rs.json";

export default createI18n({
  allowComposition: true,
  locale: sessionStorage.getItem("language")
    ? sessionStorage.getItem("language")
    : "en",
  fallbackLocale: sessionStorage.getItem("language")
    ? sessionStorage.getItem("language")
    : "en",
  messages: {
    en,
    rs,
  },
  numberFormats: {
    en: {
      currency: {
        style: "currency",
        currency: "USD",
      },
    },
    rs: {
      currency: {
        style: "currency",
        currency: "RSD",
      },
    },
  },
});
