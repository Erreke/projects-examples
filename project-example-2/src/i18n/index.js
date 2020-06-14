import Vue from "vue";
import VueI18n from "vue-i18n";

import errorsEN from "./block-errors.en.json";
import globalEN from "./block-global.en.json";
import headerEN from "./block-header.en.json";
import authEN from "./block-auth.en.json";
import navigationEN from "./block-navigation.en.json";
import homePageEN from "./page-home.en.json";

import errorsRU from "./block-errors.ru.json";
import globalRU from "./block-global.ru.json";
import headerRU from "./block-header.ru.json";
import authRU from "./block-auth.ru.json";
import navigationRU from "./block-navigation.ru.json";
import homePageRU from "./page-home.ru.json";

Vue.use(VueI18n);

const messages = {
  en: {
    "block-auth": authEN,
    "block-errors": errorsEN,
    "block-global": globalEN,
    "block-header": headerEN,
    "block-navigation": navigationEN,
    "page-home": homePageEN
  },
  ru: {
    "block-auth": authRU,
    "block-errors": errorsRU,
    "block-global": globalRU,
    "block-header": headerRU,
    "block-navigation": navigationRU,
    "page-home": homePageRU
  }
};

let i18n;

export default function createI18n() {
  if (!i18n) {
    i18n = new VueI18n({
      locale: localStorage.getItem("lang") || "ru",
      messages
    });
  }

  return i18n;
}
