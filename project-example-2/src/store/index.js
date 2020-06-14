import Vue from "vue";
import Vuex from "vuex";

import moduleUi from "./modules/ui";
import moduleAuth from "./modules/auth";
import moduleUser from "./modules/user";
import subscribeToFirestore from "./plugins/subscribe-to-firestore";

Vue.use(Vuex);

let store;

export default function createStore() {
  if (!store) {
    store = new Vuex.Store({
      strict: process.env.NODE_ENV !== "production",
      modules: {
        ui: moduleUi,
        auth: moduleAuth,
        user: moduleUser
      },
      plugins: [subscribeToFirestore],
      actions: {
        RESET_STATE: ({ commit }) => {
          commit("auth/RESET_STATE", null, { root: true });
          commit("user/RESET_STATE", null, { root: true });
        }
      }
    });
  }

  return store;
}
