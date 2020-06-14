import tariffAPI from '@/api/tariff';

export default {
  FETCH_USER_TARIFFS({ state, commit }, uid) {
    if (state.items.length) return Promise.resolve(true);

    commit('SET_TARIFFS_LOADING', true);

    return tariffAPI.fetchUserTariffs(uid)
      .then((items) => {
        commit('SET_TARIFFS', { uid, items });
        commit('SET_TARIFFS_LOADING', false);
      })
      .catch((error) => {
        commit('SET_TARIFFS_LOADING_ERROR', error.message);
        commit('SET_TARIFFS_LOADING', false);
      });
  },

  SELECT_TARIFF({ commit }, { uid, tariff, priceUSD }) {
    commit('SET_TARIFFS_SELECTING', true);

    return tariffAPI.selectTariff(uid, tariff, priceUSD)
      .then((response) => {
        commit('SET_TARIFFS_SELECTING_RESULT', response);
        commit('SET_TARIFFS_SELECTING', false);
      })
      .catch((error) => {
        commit('SET_TARIFFS_SELECTING_ERROR', error.message);
        commit('SET_TARIFFS_SELECTING_RESULT', false);
        commit('SET_TARIFFS_SELECTING', false);
      });
  },

  CANCEL_BUYING({ commit }, id) {
    commit('SET_CANCEL_BUYING_PROCESS', true);

    return tariffAPI.cancelBuying(id)
      .then(() => {
        commit('SET_CANCEL_BUYING_PROCESS', false);
      })
      .catch(() => {
        commit('SET_CANCEL_BUYING_PROCESS', false);
      });
  },

  ATTEMPT_TO_PAY({ commit }, id) {
    commit('SET_ATTEMPTING_TO_PAY_PROCESS', true);

    return tariffAPI.attemptToPay(id)
      .then(() => {
        commit('SET_ATTEMPTING_TO_PAY_PROCESS', false);
      })
      .catch(() => {
        commit('SET_ATTEMPTING_TO_PAY_PROCESS', false);
      });
  },
};
