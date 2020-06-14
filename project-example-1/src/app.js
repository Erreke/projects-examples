import Vue from 'vue';
import Buefy from 'buefy';
import Meta from 'vue-meta';
import Vuelidate from 'vuelidate';
import VueScrollTo from 'vue-scrollto';
import VueCroppie from 'vue-croppie';

import App from '@/App.vue';
import globalMixin from '@/utils/mixins/global';
import dateFormatFilter from '@/utils/filters/date-format';
import dateTimeFormatFilter from '@/utils/filters/date-time-format';
import currencyFormatFilter from '@/utils/filters/currency-format';
import numberFormatFilter from '@/utils/filters/number-format';
import cleaveDirective from '@/utils/directives/cleave';
import phoneDirective from '@/utils/directives/phone';
import businessPlaceDirective from '@/utils/directives/business-place';

import '@/utils/register-service-worker';

import 'buefy/dist/buefy.css';
import '@/assets/buefy-fixes.scss';

Vue.config.productionTip = false;

Vue.use(Meta);
Vue.use(Buefy);
Vue.use(Vuelidate);
Vue.use(VueScrollTo);
Vue.use(VueCroppie);

Vue.mixin(globalMixin);

Vue.filter('date_format', dateFormatFilter);
Vue.filter('date_time_format', dateTimeFormatFilter);
Vue.filter('currency_format', currencyFormatFilter);
Vue.filter('number_format', numberFormatFilter);

Vue.directive('cleave', cleaveDirective);
Vue.directive('phone', phoneDirective);
Vue.directive('business-place', businessPlaceDirective);

Vue.component('v-chart', () => import('vue-echarts'));
Vue.component('admin-layout', () => import('@/views/layouts/admin.vue'));
Vue.component('user-layout', () => import('@/views/layouts/user.vue'));

export default function createApp(router, store, i18n) {
  return new Vue({
    store,
    router,
    i18n,
    render: h => h(App),

    data() {
      return {
        screenWidth: 0,
        device: null,
      };
    },

    created() {
      this.setScreenWidth();

      window.addEventListener('resize', this.setScreenWidth);
      window.APP_VERSION = '0.0.2';
    },

    methods: {
      setScreenWidth() {
        this.screenWidth = window.innerWidth;

        if (this.screenWidth <= 425) {
          this.device = 'mobile';
        } else if (this.screenWidth >= 426 && this.screenWidth <= 768) {
          this.device = 'tablet';
        } else if (this.screenWidth >= 769 && this.screenWidth <= 1024) {
          this.device = 'desktop';
        } else if (this.screenWidth >= 1025 && this.screenWidth <= 1440) {
          this.device = 'widescreen';
        } else if (this.screenWidth >= 1441) {
          this.device = 'fullhd';
        }
      },
    },
  });
}
