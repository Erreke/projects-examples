import authAPI from "@/api/auth";

export default {
  VERIFY_PASSWORD_RESET_CODE({ commit }, code) {
    return authAPI.verifyPasswordResetCode(code).catch(error => {
      commit("PUSH_ERROR", error.code.replace("auth/", ""));
    });
  },

  CONFIRM_PASSWORD_RESET({ commit }, { actionCode, password }) {
    commit("SET_PROCESSING", true);

    return authAPI
      .confirmPasswordReset(actionCode, password)
      .then(() => {
        commit("auth/SET_ACTIVE_TAB", "login", { root: true });
        commit("auth/SET_POPUP_OPENED_STATUS", true, { root: true });

        commit("SET_RESULT", true);
        commit("SET_PROCESSING", false);

        return true;
      })
      .catch(error => {
        commit("SET_PROCESSING", false);
        commit("PUSH_ERROR", error.code.replace("auth/", ""));

        return false;
      });
  }
};
