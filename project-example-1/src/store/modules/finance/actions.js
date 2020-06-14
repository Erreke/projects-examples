import API from '@/api';
import financeAPI from '@/api/finance';

export default {
  FETCH_FINANCES({ state, commit }, uid) {
    if (state.items.length) return Promise.resolve(true);

    commit('SET_FINANCES_LOADING', true);

    return financeAPI.fetchFinances(uid)
      .then((items) => {
        commit('SET_FINANCES', { uid, items });
        commit('SET_FINANCES_LOADING', false);
      });
  },

  ADD_WITHDRAWAL_REQUEST({ commit }, payload) {
    commit('SET_WITHDRAWAL_REQUEST_ADDING_PROCESS', true);

    return financeAPI.addWithdrawalRequest(payload)
      .then(() => commit('SET_WITHDRAWAL_REQUEST_ADDING_PROCESS', false));
  },

  ADD_TRANSFER_REQUEST({ commit }, payload) {
    commit('SET_TRANSFER_REQUEST_ADDING_PROCESS', true);

    return financeAPI.addTransferRequest(payload)
      .then(() => commit('SET_TRANSFER_REQUEST_ADDING_PROCESS', false));
  },

  GET_BENEFICIAR_BY_EMAIL({ commit }, email) {
    commit('CLEAR_BENEFICIAR_GETTING_ERROR');
    commit('CLEAR_BENEFICIAR_DATA');
    commit('SET_BENEFICIAR_BY_EMAIL_GETTING_PROCESS', true);

    return API.getBeneficiarByEmail(email)
      .then((response) => {
        commit('SET_BENEFICIAR_DATA', response.data);
        commit('SET_BENEFICIAR_BY_EMAIL_GETTING_PROCESS', false);
      })
      .catch((e) => {
        commit('SET_BENEFICIAR_GETTING_ERROR', e.response.data.error);
        commit('SET_BENEFICIAR_BY_EMAIL_GETTING_PROCESS', false);
      });
  },

};
