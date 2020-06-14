import authAPI from '@/api/auth';
import businessPlaceAPI from '@/api/business-place';

export default {
  FETCH_USER_BUSINESS_PLACES({ state, dispatch, commit }, uid) {
    if (state.items.length) return Promise.resolve(true);

    commit('SET_USER_BUSINESS_PLACES_LOADING', true);

    return businessPlaceAPI.fetchUserBusinessPlaces(uid)
      .then((items) => {
        commit('SET_USER_BUSINESS_PLACES', { uid, items });
        commit('SET_USER_BUSINESS_PLACES_LOADING', false);

        return items;
      })
      .then((items) => {
        const filteredItems = items.filter((item) => {
          let isMore24HoursSinceLastSync = true;

          if (item.synchronizedAt) {
            const now = Date.now();
            const timeToSync = (item.synchronizedAt.seconds * 1000) + (24 * 60 * 60 * 1000);

            isMore24HoursSinceLastSync = timeToSync < now;
          }

          return item.isTimeToSynchronize || isMore24HoursSinceLastSync;
        });

        if (filteredItems.length) {
          return Promise.all(filteredItems.map(item => dispatch('UPDATE_BUSINESS_PLACE', item.id)));
        }

        return true;
      });
  },

  UPDATE_BUSINESS_PLACE(context, id) {
    return businessPlaceAPI.updateBusinessPlace(id);
  },

  SAVE_SELECTED_PACKAGE_AND_GET_PAY_URL({ commit }, { uid, packageName }) {
    commit('SET_SELECTED_PACKAGE_SAVING_PROCESS', true);

    return businessPlaceAPI
      .saveSelectedPackageAndGetPayUrl(uid, packageName)
      .then(() => {
        commit('SET_SELECTED_PACKAGE_SAVING_PROCESS', false);
      })
      .catch((error) => {
        commit('SET_SELECTED_PACKAGE_SAVING_PROCESS', false);
        commit('SET_SELECTED_PACKAGE_ERROR', error);
      });
  },

  ATTEMPT_TO_PAY_INSTIME({ commit }, id) {
    commit('SET_INSTIME_PAY_ATTEMPTING_PROCESS', true);

    return businessPlaceAPI.attemptToPayInstime(id)
      .then(() => {
        commit('SET_INSTIME_PAY_ATTEMPTING_PROCESS', false);

        return true;
      })
      .catch((error) => {
        commit('SET_INSTIME_PAY_ATTEMPTING_PROCESS', false);
        commit('SET_INSTIME_PAY_ATTEMPTING_ERROR', error);

        return false;
      });
  },

  ATTEMPT_TO_PAY_AUTOMATON({ commit }, id) {
    commit('SET_AUTOMATON_PAY_ATTEMPTING_PROCESS', true);

    return businessPlaceAPI.attemptToPay(id)
      .then(() => {
        commit('SET_AUTOMATON_PAY_ATTEMPTING_PROCESS', false);

        return true;
      })
      .catch((error) => {
        commit('SET_AUTOMATON_PAY_ATTEMPTING_PROCESS', false);
        commit('SET_AUTOMATON_PAY_ATTEMPTING_ERROR', error);

        return false;
      });
  },

  CHECK_INSTIME_PAYMENT_INFO({ commit }, id) {
    commit('SET_INSTIME_PAYMENT_INFO_CHECKING_PROCESS', true);

    return businessPlaceAPI.updateBusinessPlace(id)
      .then(() => {
        commit('SET_INSTIME_PAYMENT_INFO_CHECKING_PROCESS', false);

        return true;
      })
      .catch((error) => {
        commit('SET_INSTIME_PAYMENT_INFO_CHECKING_PROCESS', false);
        commit('SET_INSTIME_PAYMENT_INFO_CHECKING_ERROR', error);

        return false;
      });
  },

  CHECK_AUTOMATON_PAYMENT_INFO({ commit }, id) {
    commit('SET_AUTOMATON_PAYMENT_INFO_CHECKING_PROCESS', true);

    return businessPlaceAPI.updateBusinessPlace(id)
      .then(() => {
        commit('SET_AUTOMATON_PAYMENT_INFO_CHECKING_PROCESS', false);

        return true;
      })
      .catch((error) => {
        commit('SET_AUTOMATON_PAYMENT_INFO_CHECKING_PROCESS', false);
        commit('SET_AUTOMATON_PAYMENT_INFO_CHECKING_ERROR', error);

        return false;
      });
  },

  async SAVE_BUSINESS_PLACE_FIELD({ commit }, payload) {
    commit('SET_BUSINESS_PLACE_FIELD_SAVING_PROCESS', true);

    const token = await authAPI.getCurrentUserIdToken();

    return businessPlaceAPI.changeBusinessPlaceField(payload, token)
      .then(() => {
        commit('SET_BUSINESS_PLACE_FIELD_SAVING_PROCESS', false);

        return true;
      })
      .catch((error) => {
        commit('SET_BUSINESS_PLACE_FIELD_SAVING_PROCESS', false);
        commit('MERGE_BUSINESS_PLACE_FIELD_SAVING_ERROR', error.response.data.errors);

        return false;
      });
  },

  CANCEL_BUYING({ commit }, id) {
    commit('SET_CANCEL_BUYING_PROCESS', true);

    return businessPlaceAPI.cancelBuying(id)
      .then(() => {
        commit('SET_CANCEL_BUYING_PROCESS', false);
      })
      .catch(() => {
        commit('SET_CANCEL_BUYING_PROCESS', false);
      });
  },
};
