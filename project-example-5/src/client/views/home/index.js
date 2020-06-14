import Vue from 'vue';
import vuelidate from 'vuelidate';
import App from './_home.vue';

import 'bulma';
import '../../common.scss';

Vue.use(vuelidate);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount('#app');
