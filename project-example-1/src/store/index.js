import Vue from 'vue';
import Vuex from 'vuex';

import moduleInterface from './modules/interface';
import moduleAuth from './modules/auth';
import moduleUser from './modules/user';
import moduleBusinessPlace from './modules/business-place';
// import moduleFinance from './modules/finance';
// import modulePricing from './modules/pricing';
// import moduleAdmin from './modules/admin';
import subscribeToFirestore from './plugins/subscribe-to-firestore';
import moduleAdminBusinessPlacePlugin from './modules/business-place/subscribe-to-firestore';

Vue.use(Vuex);

let store;

export default function createStore() {
  if (!store) {
    store = new Vuex.Store({
      strict: process.env.NODE_ENV !== 'production',
      modules: {
        interface: moduleInterface,
        auth: moduleAuth,
        user: moduleUser,
        'business-place': moduleBusinessPlace,
        // finance: moduleFinance,
        // pricing: modulePricing,
        // admin: moduleAdmin,
      },
      plugins: [
        subscribeToFirestore,
        moduleAdminBusinessPlacePlugin,
      ],
      actions: {
        RESET_STATE: ({ commit }) => {
          commit('interface/RESET_STATE', null, { root: true });
          commit('auth/RESET_STATE', null, { root: true });
          commit('user/RESET_STATE', null, { root: true });
        },
      },
    });
  }

  return store;
}
