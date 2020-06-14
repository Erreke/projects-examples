import Vue from "vue";
import Vuelidate from "vuelidate";
import VueMeta from "vue-meta";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

import "@/utils/vuetify";
import "@/utils/firebaseInit";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import i18n from "@/i18n";
import globalMixin from "@/utils/globalMixin";

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";

Vue.use(Vuelidate);
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});

Vue.config.productionTip = false;

Vue.mixin(globalMixin);

async function tryToAuth(user) {
  if (user) {
    await store.dispatch("INIT_USER", user);
  } else {
    await store.commit("UNSET_USER");
  }
}

function createApp() {
  return new Vue({
    router,

    store,

    i18n,

    render: h => h(App),

    data() {
      return {
        screenWidth: 0,
        device: null
      };
    },

    created() {
      this.setScreenWidth();

      window.addEventListener("resize", this.setScreenWidth);
    },

    methods: {
      setScreenWidth() {
        this.screenWidth = window.innerWidth;

        if (this.screenWidth < 600) {
          this.device = "mobile";
        } else if (this.screenWidth >= 600 && this.screenWidth < 960) {
          this.device = "tablet";
        } else if (this.screenWidth >= 960 && this.screenWidth < 1264) {
          this.device = "desktop";
        } else if (this.screenWidth >= 1264 && this.screenWidth < 1904) {
          this.device = "widescreen";
        } else if (this.screenWidth >= 1904) {
          this.device = "fullhd";
        }
      }
    }
  });
}

let app;

firebase.auth().onAuthStateChanged(user => {
  // eslint-disable-next-line no-console
  console.time("Initializing");

  tryToAuth(user).then(() => {
    if (!app) {
      app = createApp();
      app.$mount("#app");
    }

    // eslint-disable-next-line no-console
    console.timeEnd("Initializing");
  });
});
