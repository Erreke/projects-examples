import Vue from "vue";
import Vuelidate from "vuelidate";
import VueMeta from "vue-meta";
import firebase from "firebase/app";
import "firebase/auth";
import "@/utils/vuetify";
import "@/firebase/init";

import App from "@/App.vue";
import router from "@/router";
import store from "@/store";
import i18n from "@/i18n";
import globalMixin from "@/utils/globalMixin";
import { TIME_SIMPLE, DATETIME_FULL } from "@/utils/filters";
import { clickOutsideDirective } from "@/utils/directives";

Vue.config.productionTip = false;

Vue.use(Vuelidate);
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
});

Vue.mixin(globalMixin);
Vue.filter("TIME_SIMPLE", TIME_SIMPLE);
Vue.filter("DATETIME_FULL", DATETIME_FULL);
Vue.directive("click-outside", clickOutsideDirective);

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
    data() {
      return {
        screenWidth: 0,
        device: null
      };
    },

    created() {
      this.setScreenWidth();

      window.addEventListener("resize", this.setScreenWidth);
      window.addEventListener("beforeunload", this.unsubscribeFromFirestore);
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
      },

      unsubscribeFromFirestore() {
        store.commit("UNSUBSCRIBE_FROM_FIRESTORE");
      }
    },

    render: h => h(App)
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
