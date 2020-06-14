import Vue from "vue";
import Buefy from "buefy";
import Meta from "vue-meta";
import Vuelidate from "vuelidate";
import VueCroppie from "vue-croppie";

import App from "@/App.vue";
import globalMixin from "@/utils/mixins/global";
import dateFormatFilter from "@/utils/filters/date-format";
import dateTimeFormatFilter from "@/utils/filters/date-time-format";
import currencyFormatFilter from "@/utils/filters/currency-format";
import numberFormatFilter from "@/utils/filters/number-format";

import "@/utils/register-service-worker";
import "@/assets/buefy-fixes.scss";
import "video.js/dist/video-js.css";

Vue.config.productionTip = false;

Vue.use(Meta);
Vue.use(Buefy);
Vue.use(Vuelidate);
Vue.use(VueCroppie);
Vue.mixin(globalMixin);

Vue.filter("date_format", dateFormatFilter);
Vue.filter("date_time_format", dateTimeFormatFilter);
Vue.filter("currency_format", currencyFormatFilter);
Vue.filter("number_format", numberFormatFilter);

Vue.component("default-layout", () => import("@/views/layouts/default.vue"));
Vue.component("cabinet-layout", () => import("@/views/layouts/cabinet.vue"));

export default function createApp(router, store, i18n) {
  return new Vue({
    store,
    router,
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
      window.APP_VERSION = "0.1.0";
    },

    methods: {
      setScreenWidth() {
        this.screenWidth = window.innerWidth;

        if (this.screenWidth <= 768) {
          this.device = "mobile";
        } else if (this.screenWidth >= 769 && this.screenWidth <= 1023) {
          this.device = "tablet";
        } else if (this.screenWidth >= 1024 && this.screenWidth <= 1215) {
          this.device = "desktop";
        } else if (this.screenWidth >= 1216 && this.screenWidth <= 1407) {
          this.device = "widescreen";
        } else if (this.screenWidth >= 1408) {
          this.device = "fullhd";
        }
      }
    }
  });
}
