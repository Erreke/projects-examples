import API from '@/api';
import profileAPI from '@/api/profile';
import createI18n from '@/i18n';

const { locale } = createI18n();

function composeUserProfile(user, userData) {
  return {
    // data from Firebase.Auth
    uid: user.uid,
    email: user.email,
    phone: user.phoneNumber,
    emailVerified: user.emailVerified,

    // data from Firestore 'profiles' table
    ...userData,
  };
}

export default {
  INIT_USER({ commit }, user) {
    return profileAPI
      .fetchUserProfile(user.uid)
      .then((userData) => {
        const userProfile = composeUserProfile(user, userData);

        commit('SET_USER', userProfile);
        commit('auth/SET_POPUP_OPENED_STATUS', false, { root: true });
        commit('auth/sign-in/SET_PROCESSING', false, { root: true });

        return userProfile;
      });
  },

  SAVE_USER_INFO({ commit }, {
    uid, fields, values, loader,
  }) {
    if (loader) {
      commit(loader, true, { root: true });
    }

    return profileAPI.saveUserInfo(uid, fields, values)
      .then(() => {
        if (loader) {
          commit(loader, false, { root: true });
        }

        return true;
      });
  },

  FETCH_CITIES({ commit }, city) {
    commit('CLEAR_CITY_FETCHING_ERROR');
    commit('SET_CITY_FETCHING_PROCESS', true);

    return API.fetchCities(locale, city)
      .then((response) => {
        commit('SET_CITY_FETCHING_PROCESS', false);

        commit('SET_FETCHED_CITIES', response.data);
      })
      .catch((err) => {
        let error;

        if (err.message) {
          error = err.message;
        } else if (error.code) {
          error = error.code;
        } else {
          error = err;
        }

        commit('SET_CITY_FETCHING_PROCESS', false);
        commit('SET_CITY_FETCHING_ERROR', error);
        commit('SET_FETCHED_CITIES', []);
      });
  },

  FETCH_USER_DISCOUNT({ state, commit }, uid) {
    if (state.discountDeadline) return Promise.resolve(true);

    return profileAPI.fetchUserDiscount(uid)
      .then((response) => {
        commit('SET_USER_DISCOUNT', { uid, deadline: response });
      });
  },
};
