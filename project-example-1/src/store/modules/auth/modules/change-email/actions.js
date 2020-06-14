import authAPI from '@/api/auth';
import API from '@/api';

export default {
  CHANGE_USER_EMAIL({ dispatch, commit, rootState }, { currentPassword, email }) {
    commit('CLEAR_ALL_ERRORS');
    commit('SET_PROCESSING', true);

    return authAPI.changeUserEmail(currentPassword, email)
      .then(() => dispatch('user/SAVE_USER_INFO', {
        uid: rootState.user.profile.uid,
        fields: ['email'],
        values: [email],
      }, { root: true })
        .then(() => true))
      .catch((error) => {
        commit('SET_PROCESSING', false);
        commit('PUSH_ERROR', error.code.replace('auth/', ''));

        return false;
      });
  },

  SEND_VERIFICATION_CODE_TO_NEW_EMAIL({ commit }, uid) {
    return API.sendVerificationCode({ uid })
      .then(() => {
        commit('auth/SET_ACTIVE_TAB', 'login', { root: true });
        commit('auth/SET_POPUP_OPENED_STATUS', true, { root: true });
        commit('SET_RESULT', true);
        commit('SET_PROCESSING', false);
      });
  },
};
