import authAPI from "@/api/auth";
import { sendVerificationCode } from "@/api";

export default {
  VERIFY_EMAIL({ commit }, actionCode) {
    return authAPI
      .applyActionCode(actionCode)
      .then(() => {
        commit("SET_RESULT", true);
        commit("SET_POPUP_OPENED_STATUS", false);

        commit("auth/SET_ACTIVE_TAB", "login", { root: true });
        commit("auth/SET_POPUP_OPENED_STATUS", true, { root: true });

        return true;
      })
      .catch(error => {
        commit("PUSH_ERROR", error.code.replace("auth/", ""));

        return false;
      });
  },

  GET_EMAIL_VERIFICATION_INFO({ commit }) {
    return authAPI.getEmailVerificationInfo().then(response => {
      if (response) {
        commit("user/UPDATE_USER", { emailVerified: response }, { root: true });
      }
    });
  },

  SEND_VERIFICATION_CODE({ commit }, { uid }) {
    commit("SET_PROCESSING", true);
    commit("CLEAR_ALL_ERRORS");

    return sendVerificationCode({ uid })
      .then(() => {
        commit("SET_CODE_SENDING_RESULT", true);
        commit("SET_PROCESSING", false);

        return true;
      })
      .catch(e => {
        commit("SET_ERRORS", e.response.data.errors);
        commit("SET_PROCESSING", false);

        return false;
      });
  }
};
