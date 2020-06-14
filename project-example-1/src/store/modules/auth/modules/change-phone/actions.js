import authAPI from '@/api/auth';

export default {
  START_CHANGING_USER_PHONE({ commit }, { phoneNumber, recaptchaContainerId }) {
    commit('CLEAR_ALL_FIRST_FORM_ERRORS');
    commit('SET_FIRST_FORM_PROCESSING', true);
    commit('SET_TEMP_NEW_PHONE_NUMBER', phoneNumber);

    return authAPI.sendSMSForPhoneNumberVerification(phoneNumber, recaptchaContainerId)
      .then((verificationId) => {
        commit('SET_FIRST_FORM_RESULT', verificationId);
        commit('SET_FIRST_FORM_PROCESSING', false);

        return true;
      })
      .catch((error) => {
        commit('SET_FIRST_FORM_PROCESSING', false);
        commit('PUSH_FIRST_FORM_ERROR', error.code.replace('auth/', ''));

        return false;
      });
  },

  COMPLETE_CHANGING_USER_PHONE({
    state, commit, dispatch, rootState,
  }, { smsCode, currentPassword }) {
    commit('CLEAR_ALL_SECOND_FORM_ERRORS');
    commit('SET_SECOND_FORM_PROCESSING', true);

    const verificationId = state.firstFormResult;
    const phoneCredential = authAPI.getPhoneCredential(verificationId, smsCode);

    return authAPI.changeUserPhone(currentPassword, phoneCredential)
      .then(() => {
        commit('SET_SECOND_FORM_RESULT', true);
        commit('SET_SECOND_FORM_PROCESSING', false);

        return true;
      })
      .then(() => dispatch('user/SAVE_USER_INFO', {
        uid: rootState.user.profile.uid,
        fields: ['phone'],
        values: [state.tempNewPhoneNumber],
      }, { root: true })
        .then(() => {
          commit('SET_TEMP_NEW_PHONE_NUMBER', null);

          return true;
        }))
      .catch((error) => {
        commit('SET_SECOND_FORM_PROCESSING', false);
        commit('PUSH_SECOND_FORM_ERROR', error.code.replace('auth/', ''));

        return false;
      });
  },
};
