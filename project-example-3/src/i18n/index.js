import Vue from "vue";
import VueI18n from "vue-i18n";

// eng blocks
import errorsEN from "./block-errors.en.json";
import authEN from "./block-auth.en.json";
import loaderEN from "./block-loader.en.json";
import navigationEN from "./block-navigation.en.json";

// eng pages
import homeEN from "./page-home.en.json";
import adminEN from "./page-admin.en.json";
import quizEN from "./page-quiz.en.json";
import notFoundEN from "./page-not-found.en.json";

// rus blocks
import errorsRU from "./block-errors.ru.json";
import authRU from "./block-auth.ru.json";
import loaderRU from "./block-loader.ru.json";
import navigationRU from "./block-navigation.ru.json";

// rus pages
import homeRU from "./page-home.ru.json";
import adminRU from "./page-admin.ru.json";
import quizRU from "./page-quiz.ru.json";
import notFoundRU from "./page-not-found.ru.json";

Vue.use(VueI18n);

const messages = {
  en: {
    "block-errors": errorsEN,
    "block-auth": authEN,
    "block-loader": loaderEN,
    "block-navigation": navigationEN,

    "page-home": homeEN,
    "page-admin": adminEN,
    "page-quiz": quizEN,
    "page-not-found": notFoundEN
  },
  ru: {
    "block-errors": errorsRU,
    "block-auth": authRU,
    "block-loader": loaderRU,
    "block-navigation": navigationRU,

    "page-home": homeRU,
    "page-admin": adminRU,
    "page-quiz": quizRU,
    "page-not-found": notFoundRU
  }
};

export default new VueI18n({
  locale: localStorage.getItem("lang") || "ru",
  messages
});
