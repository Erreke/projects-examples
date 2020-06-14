import clientsAPI from '@/api/admin/clients';
import tariffAPI from '@/api/admin/tariff';

export default {
  FETCH_ALL_TARIFF({ rootState, commit }) {
    commit('SET_ALL_TARIFF_FETCHING', true);

    const promises = [];
    const commits = [];

    if (Object.keys(rootState.admin.clients.clients).length === 0) {
      promises.push(clientsAPI.fetchClientsProfiles());
      commits.push('admin/clients/SET_CLIENTS_PROFILES');
    }

    if (rootState.admin.tariff.items.length === 0) {
      promises.push(tariffAPI.fetchAllTariff());
      commits.push('admin/tariff/SET_ALL_TARIFF');
    }

    if (promises.length === 0) {
      commit('SET_ALL_TARIFF_FETCHING', false);
      return Promise.resolve(true);
    }

    return Promise.all(promises)
      .then((response) => {
        commit(commits[0], response[0], { root: true });

        if (response.length === 2) {
          commit(commits[1], response[1], { root: true });
        }

        commit('SET_ALL_TARIFF_FETCHING', false);
      })
      .catch((error) => {
        commit('SET_ALL_TARIFF_FETCHING_ERROR', error.message);
        commit('SET_ALL_TARIFF_FETCHING', false);
      });
  },

  CONFIRM_PAYMENT({ commit }, { id, amountTNG }) {
    commit('SET_PAYMENT_CONFIRMING', true);

    return tariffAPI.confirmPayment(id, amountTNG)
      .then(() => {
        commit('SET_PAYMENT_CONFIRMING', false);
      })
      .catch((error) => {
        commit('SET_PAYMENT_CONFIRMING', false);
        commit('SET_PAYMENT_CONFIRMING_ERROR', error);
      });
  },

  RUN_AD({ commit }, { id }) {
    commit('SET_AD_RUNNING', true);

    return tariffAPI.runAd(id)
      .then(() => {
        commit('SET_AD_RUNNING', false);
      })
      .catch((error) => {
        commit('SET_AD_RUNNING', false);
        commit('SET_AD_RUNNING_ERROR', error);
      });
  },

  STOP_AD({ commit }, { id }) {
    commit('SET_AD_STOPPING', true);

    return tariffAPI.stopAd(id)
      .then(() => {
        commit('SET_AD_STOPPING', false);
      })
      .catch((error) => {
        commit('SET_AD_STOPPING', false);
        commit('SET_AD_STOPPING_ERROR', error);
      });
  },

  EXPIRE_AD({ commit }, { id }) {
    commit('SET_AD_EXPIRING', true);

    return tariffAPI.expireAd(id)
      .then(() => {
        commit('SET_AD_EXPIRING', false);
      })
      .catch((error) => {
        commit('SET_AD_EXPIRING', false);
        commit('SET_AD_EXPIRING_ERROR', error);
      });
  },

  DELETE_ORDER({ commit }, { id }) {
    commit('SET_ORDER_DELETING', true);

    return tariffAPI.deleteOrder(id)
      .then(() => {
        commit('SET_ORDER_DELETING', false);
      })
      .catch((error) => {
        commit('SET_ORDER_DELETING', false);
        commit('SET_ORDER_DELETING_ERROR', error);
      });
  },

  FETCH_USD_RATE(context, date) {
    return tariffAPI.fetchUsdRate(date);
  },
};
