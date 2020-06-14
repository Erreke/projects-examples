import Vue from "vue";
import VueI18n from "vue-i18n";

// eng blocks
import globalEN from "./block-global.en.json";
import errorsEN from "./block-errors.en.json";
import signinEN from "./block-signin.en.json";
import loaderEN from "./block-loader.en.json";

// eng pages
import homeEN from "./page-home.en.json";
import adminEN from "./page-admin.en.json";
import streamEN from "./page-stream.en.json";
import notFoundEN from "./page-not-found.en.json";

// rus blocks
import globalRU from "./block-global.ru.json";
import errorsRU from "./block-errors.ru.json";
import signinRU from "./block-signin.ru.json";
import loaderRU from "./block-loader.ru.json";

// rus pages
import homeRU from "./page-home.ru.json";
import adminRU from "./page-admin.ru.json";
import streamRU from "./page-stream.ru.json";
import notFoundRU from "./page-not-found.ru.json";

Vue.use(VueI18n);

const messages = {
  en: {
    "block-global": globalEN,
    "block-errors": errorsEN,
    "block-signin": signinEN,
    "block-loader": loaderEN,

    "page-home": homeEN,
    "page-admin": adminEN,
    "page-stream": streamEN,
    "page-not-found": notFoundEN
  },
  ru: {
    "block-global": globalRU,
    "block-errors": errorsRU,
    "block-signin": signinRU,
    "block-loader": loaderRU,

    "page-home": homeRU,
    "page-admin": adminRU,
    "page-stream": streamRU,
    "page-not-found": notFoundRU
  }
};

export default new VueI18n({
  locale: localStorage.getItem("lang") || "ru",
  messages
});
