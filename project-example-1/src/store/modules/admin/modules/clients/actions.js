/* eslint-disable no-console */
import clientsAPI from '@/api/admin/clients';

export default {
  FETCH_CLIENTS_PROFILES({ state, commit }) {
    commit('SET_CLIENTS_PROFILES_LOADING', true);

    if (Object.keys(state.clients).length > 0) {
      commit('SET_CLIENTS_PROFILES_LOADING', false);
      return Promise.resolve(true);
    }

    return clientsAPI.fetchClientsProfiles()
      .then((clients) => {
        commit('SET_CLIENTS_PROFILES', clients);
        commit('SET_CLIENTS_PROFILES_LOADING', false);
      });
  },

  FETCH_CLIENTS_DISCOUNTS({ state, commit }) {
    if (Object.keys(state.discounts).length > 0) return Promise.resolve(true);

    return clientsAPI.fetchClientsDiscounts()
      .then((discounts) => {
        commit('SET_CLIENTS_DISCOUNTS', discounts);
      });
  },

  DELETE_CLIENT(context, { uid, aid }) {
    return clientsAPI.deleteClient(uid, aid)
      .then(() => clientsAPI.deleteClientProfile(uid));
  },

  SAVE_CLIENT_INFO(context, { uid, fields, values }) {
    return clientsAPI.saveClientInfo(uid, fields, values);
  },

  FETCH_CLIENTS_QUEUE({ commit }) {
    return clientsAPI.fetchClientsQueue()
      .then(clients => commit('SET_CLIENTS_QUEUE', clients));
  },

  CREATE_CLIENT_DISCOUNT_DEADLINE({ commit }, { uid, deadline, manager }) {
    commit('SET_CLIENT_DISCOUNT_DEADLINE_SAVING', true);

    return clientsAPI.createClientDiscountDeadline(uid, deadline, manager)
      .then(() => {
        commit('SET_CLIENT_DISCOUNT_DEADLINE_SAVING', false);
      });
  },

  UPDATE_CLIENT_DISCOUNT_DEADLINE({ commit }, { uid, deadline, manager }) {
    commit('SET_CLIENT_DISCOUNT_DEADLINE_SAVING', true);

    return clientsAPI.updateClientDiscountDeadline(uid, deadline, manager)
      .then(() => {
        commit('SET_CLIENT_DISCOUNT_DEADLINE_SAVING', false);
      });
  },

  DELETE_CLIENT_DISCOUNT_DEADLINE({ commit }, uid) {
    commit('SET_CLIENT_DISCOUNT_DEADLINE_SAVING', true);

    return clientsAPI.deleteClientDiscountDeadline(uid)
      .then(() => {
        commit('SET_CLIENT_DISCOUNT_DEADLINE_SAVING', false);
      });
  },

  CREATE_CLIENT({ commit }, payload) {
    commit('SET_CLIENT_CREATING_PROCESS', true);
    commit('CLEAR_ALL_CLIENT_CREATING_ERRORS');

    return clientsAPI
      .createClient(payload)
      .then(() => {
        commit('SET_CLIENT_CREATING_PROCESS', false);

        return true;
      })
      .catch((err) => {
        let errors;

        if (err.response && err.response.data && err.response.data.errors) {
          errors = err.response.data.errors;
        } else if (err.message) {
          errors = err.message;
        } else if (errors.code) {
          errors = errors.code;
        } else {
          errors = 'unknown-error';
        }

        commit('SET_CLIENT_CREATING_PROCESS', false);
        commit('MERGE_CLIENT_CREATING_ERROR', errors);

        return false;
      });
  },
};
