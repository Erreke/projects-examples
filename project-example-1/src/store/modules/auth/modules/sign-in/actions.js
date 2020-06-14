import authAPI from '@/api/auth';

export default {
  SIGN_IN({ dispatch, commit }, { email, password }) {
    commit('SET_PROCESSING', true);

    commit('auth/change-password/CLEAR_ALL_ERRORS', null, { root: true });
    commit('auth/email-verification/CLEAR_ALL_ERRORS', null, { root: true });
    commit('auth/recover-password/CLEAR_ALL_ERRORS', null, { root: true });
    commit('auth/reset-password/CLEAR_ALL_ERRORS', null, { root: true });
    commit('auth/sign-up/CLEAR_ALL_ERRORS', null, { root: true });
    commit('auth/sign-up-to-webinar/CLEAR_ALL_ERRORS', null, { root: true });
    commit('auth/change-email/CLEAR_ALL_ERRORS', null, { root: true });

    commit('CLEAR_ALL_ERRORS');

    commit('auth/change-password/SET_RESULT', false, { root: true });
    commit('auth/email-verification/SET_RESULT', false, { root: true });
    commit('auth/recover-password/SET_RESULT', false, { root: true });
    commit('auth/reset-password/SET_RESULT', false, { root: true });
    commit('auth/sign-up/SET_RESULT', false, { root: true });
    commit('auth/sign-up-to-webinar/SET_RESULT', false, { root: true });
    commit('auth/change-email/SET_RESULT', false, { root: true });

    return authAPI
      .signIn(email, password)
      .then((response) => {
        commit('CLEAR_ALL_ERRORS');

        return dispatch('user/INIT_USER', response.user, { root: true });
      })
      .catch((error) => {
        commit('SET_PROCESSING', false);
        commit('PUSH_ERROR', error.code.replace('auth/', ''));
      });
  },
};
