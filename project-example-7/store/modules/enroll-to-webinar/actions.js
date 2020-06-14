import enrollToWebinarAPI from '@/api/enroll-to-webinar';

export default {
  GET_PAGE_DETAILS({ commit }) {
    commit('SET_PAGE_DETAILS_LOADING', true);

    return enrollToWebinarAPI
      .getPageDetails()
      .then((response) => {
        commit('SET_PAGE_DETAILS_LOADING', false);
        commit('SET_PAGE_DETAILS', response);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);

        commit('SET_PAGE_DETAILS_LOADING', false);
        commit('SET_PAGE_DETAILS_LOADING_ERROR', true);
      });
  },

  ENROLL_TO_WEBINAR({ commit }, payload) {
    commit('CLEAR_ERRORS');
    commit('SET_FORM_PROCESSING', true);

    return enrollToWebinarAPI
      .enrollToWebinar(payload)
      .then(() => {
        commit('SET_FORM_PROCESSING', false);
        commit('SET_ENROLL_TO_WEBINAR_RESULT', true);

        return true;
      })
      .catch((error) => {
        if (error.response.data && error.response.data.errors) {
          commit('MERGE_FORM_ERRORS', error.response.data.errors);
          commit('SET_FORM_ERRORS_EXTRA', error.response.data.extra);
        } else {
          commit('MERGE_FORM_ERRORS', ['unknown-error']);
        }

        commit('SET_FORM_PROCESSING', false);

        return false;
      });
  },

};
