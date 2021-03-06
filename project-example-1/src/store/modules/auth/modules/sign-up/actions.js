import API from '@/api';

export default {
  SIGN_UP({ commit }, payload) {
    commit('auth/sign-in/CLEAR_ALL_ERRORS', null, { root: true });
    commit('auth/recover-password/CLEAR_ALL_ERRORS', null, { root: true });
    commit('CLEAR_ALL_ERRORS');

    commit('SET_PROCESSING', true);

    return API.registration(payload)
      .then((response) => {
        commit('SET_PROCESSING', false);
        commit('SET_RESULT', true);

        commit('auth/SET_ACTIVE_TAB', 'login', { root: true });
        commit('auth/SET_POPUP_OPENED_STATUS', true, { root: true });

        return response.data;
      })
      .catch((error) => {
        commit('SET_PROCESSING', false);
        commit('MERGE_ERRORS', error.response.data.errors);

        return error.response.data;
      });
  },

  VALIDATE_BONUS_HOLDER({ commit }, nickname) {
    commit('SET_BONUS_HOLDER_VALIDATING', true);
    commit('SET_BONUS_HOLDER_VALIDATING_ERRORS', []);

    return API.validateBonusHolder(nickname)
      .then((response) => {
        commit('SET_BONUS_HOLDER_VALIDATING_RESULT', response.data.result);
        commit('SET_BONUS_HOLDER_VALIDATING', false);
      })
      .catch((e) => {
        commit('SET_BONUS_HOLDER_VALIDATING_ERRORS', e.response.data.errors);
        commit('SET_BONUS_HOLDER_VALIDATING', false);
      });
  },
};
