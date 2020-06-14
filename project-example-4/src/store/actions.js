import authAPI from "@/api/auth";
import dbAPI from "@/api/db";
import { SIGN_IN_FULL_NAME_LS_KEY } from "@/config";

function composeUserProfile(user, userData) {
  return {
    // data from Firebase.Auth
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,
    phone: user.phoneNumber,

    // data from Firestore 'users' table
    fullname: userData.fullname,
    isAdmin: userData.isAdmin
  };
}

export default {
  INIT_USER({ commit }, user) {
    return dbAPI.fetchUserData(user.uid).then(userData => {
      const userProfile = composeUserProfile(user, userData);

      commit("SET_USER", userProfile);

      return userProfile;
    });
  },

  REGISTER_USER_AS_MEMBER({ state }) {
    return dbAPI.registerUserAsMember(state.user);
  },

  SEND_SMS_TO_PHONE_NUMBER: ({ commit }, { fullname, phone }) => {
    commit("CLEAR_SIGN_IN_BY_SMS_FIRST_STEP_ERROR");
    commit("SET_STATUS_TO_SIGN_IN_BY_SMS_FIRST_STEP_PROCESS", true);

    return authAPI
      .sendSMSToPhoneNumber(phone)
      .then(response => {
        commit("SET_STATUS_TO_SIGN_IN_BY_SMS_FIRST_STEP_PROCESS", false);
        commit("SET_STATUS_TO_SIGN_IN_BY_SMS_FIRST_STEP_COMPLETE", true);

        window.localStorage.setItem(SIGN_IN_FULL_NAME_LS_KEY, fullname);
        window.confirmationResult = response;
      })
      .catch(error => {
        commit("SET_STATUS_TO_SIGN_IN_BY_SMS_FIRST_STEP_PROCESS", false);
        commit(
          "SET_SIGN_IN_BY_SMS_FIRST_STEP_ERROR",
          error.code.replace("auth/", "")
        );
        commit("UNSET_USER");

        console.log("ERROR:", error);
      });
  },

  CONFIRM_SMS_CODE: ({ commit }, code) => {
    commit("CLEAR_SIGN_IN_BY_SMS_SECOND_STEP_ERROR");
    commit("SET_STATUS_TO_SIGN_IN_BY_SMS_SECOND_STEP_PROCESS", true);

    window.confirmationResult
      .confirm(code)
      .then(response => {
        const userProfile = {
          uid: response.user.uid,
          phone: response.user.phoneNumber,
          fullname:
            window.localStorage.getItem(SIGN_IN_FULL_NAME_LS_KEY) ||
            "Unknown User"
        };

        return dbAPI.createUserProfileWhenAuthBySMS(userProfile).then(() => {
          commit("SET_STATUS_TO_SIGN_IN_BY_SMS_SECOND_STEP_PROCESS", false);
          commit("SET_STATUS_TO_SIGN_IN_BY_SMS_SECOND_STEP_COMPLETE", true);
          commit("SET_STATUS_TO_SIGN_IN_BY_EMAIL_FIRST_STEP_COMPLETE", true);
          commit("SET_STATUS_TO_SIGN_IN_BY_EMAIL_SECOND_STEP_COMPLETE", true);
          window.localStorage.removeItem(SIGN_IN_FULL_NAME_LS_KEY);
        });
      })
      .catch(error => {
        commit("SET_STATUS_TO_SIGN_IN_BY_SMS_SECOND_STEP_PROCESS", false);
        commit(
          "SET_SIGN_IN_BY_SMS_SECOND_STEP_ERROR",
          error.code.replace("auth/", "")
        );
        commit("UNSET_USER");

        console.log("error:", error);
      });
  },

  SIGN_IN_REQUEST: ({ commit }, { email, password }) => {
    commit("CLEAR_SIGN_IN_FIRST_STEP_ERROR");
    commit("SET_SIGN_IN_PROCESS", true);

    return authAPI
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        commit("SET_SIGN_IN_PROCESS", false);

        return response.user;
      })
      .catch(error => {
        commit("SET_SIGN_IN_ERROR", error.code.replace("auth/", ""));
        commit("SET_SIGN_IN_PROCESS", false);
        commit("UNSET_USER");

        console.log("ERROR:", error);
      });
  },

  SEND_SIGN_IN_LINK_TO_EMAIL: ({ commit }, { email, url }) => {
    commit("CLEAR_SIGN_IN_FIRST_STEP_ERROR");
    commit("SET_SIGN_IN_PROCESS", true);

    return authAPI
      .sendSignInLinkToEmail(email, url)
      .then(() => {
        commit("SET_SIGN_IN_WITH_EMAIL_LINK_SENDING_STATUS", true);
        commit("SET_SIGN_IN_PROCESS", false);
      })
      .catch(error => {
        commit("SET_SIGN_IN_ERROR", error.code.replace("auth/", ""));
        commit("SET_SIGN_IN_PROCESS", false);
        commit("UNSET_USER");

        console.log("ERROR:", error);
      });
  },

  SIGN_IN_WITH_EMAIL_LINK: ({ commit }, { fullname, phone, email, href }) => {
    commit("SET_SIGN_IN_PROCESS", true);

    return authAPI
      .signInWithEmailLink(email, href)
      .then(response => {
        const userProfile = {
          uid: response.user.uid,
          email: response.user.email,
          fullname: fullname,
          phone: phone
        };

        return dbAPI.createUserProfile(userProfile).then(() => {
          commit("SET_SIGN_IN_PROCESS", false);
        });
      })
      .catch(error => {
        commit("SET_SIGN_IN_ERROR", error.code.replace("auth/", ""));
        commit("SET_SIGN_IN_PROCESS", false);
        commit("UNSET_USER");

        console.log("ERROR:", error);
      });
  },

  SIGN_OUT_REQUEST: ({ state, commit }) => {
    commit("SET_STATUS_TO_SIGN_OUT_PROCESS", true);

    return dbAPI.unRegisterUserAsMember(state.user.uid).then(() => {
      return authAPI.signOut().then(() => {
        commit("UNSET_USER");

        commit("CLEAR_SIGN_IN_BY_SMS_FIRST_STEP_ERROR");
        commit("SET_STATUS_TO_SIGN_IN_BY_SMS_FIRST_STEP_PROCESS", false);
        commit("SET_STATUS_TO_SIGN_IN_BY_SMS_FIRST_STEP_COMPLETE", false);

        commit("CLEAR_SIGN_IN_BY_SMS_SECOND_STEP_ERROR");
        commit("SET_STATUS_TO_SIGN_IN_BY_SMS_SECOND_STEP_PROCESS", false);
        commit("SET_STATUS_TO_SIGN_IN_BY_SMS_SECOND_STEP_COMPLETE", false);

        commit("CLEAR_SIGN_IN_BY_EMAIL_FIRST_STEP_ERROR");
        commit("SET_STATUS_TO_SIGN_IN_BY_EMAIL_FIRST_STEP_PROCESS", false);
        commit("SET_STATUS_TO_SIGN_IN_BY_EMAIL_FIRST_STEP_COMPLETE", false);

        commit("CLEAR_SIGN_IN_BY_EMAIL_SECOND_STEP_ERROR");
        commit("SET_STATUS_TO_SIGN_IN_BY_EMAIL_SECOND_STEP_PROCESS", false);
        commit("SET_STATUS_TO_SIGN_IN_BY_EMAIL_SECOND_STEP_COMPLETE", false);

        commit("SET_STATUS_TO_SIGN_OUT_PROCESS", false);
      });
    });
  },

  FETCH_STREAM: ({ commit }) => {
    return dbAPI.fetchStream().then(stream => {
      commit("SET_STREAM", stream);

      return stream;
    });
  },

  FETCH_MEMBERS: ({ commit }) => {
    return dbAPI.fetchMembers().then(members => {
      commit("SET_MEMBERS", members);
    });
  },

  FETCH_COMMENTS: ({ commit }) => {
    return dbAPI.fetchComments().then(comments => {
      commit("SET_COMMENTS", comments);
    });
  },

  SEND_COMMENT: ({ commit }, comment) => {
    commit("SET_MESSAGE_SENDING_STATUS", true);

    return dbAPI
      .sendComment(comment)
      .then(() => {
        commit("SET_MESSAGE_SENDING_STATUS", false);
      })
      .catch(error => {
        commit("SET_MESSAGE_SENDING_STATUS", false);
        commit("SET_SEND_MESSAGE_ERROR", error.code);

        throw new Error(error.code);
      });
  }
};
