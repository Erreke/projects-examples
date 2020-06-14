import businessPlaceAPI from '@/api/admin/business-place';
import makeTree from '@/store/helpers/make-tree';

export default {
  FETCH_BUSINESS_PLACES({ state, commit, rootState }) {
    commit('SET_BUSINESS_PLACES_FETCHING_PROCESS', true);

    if (Object.keys(state.items).length > 0) {
      commit('SET_BUSINESS_PLACES_FETCHING_PROCESS', false);

      return Promise.resolve(true);
    }

    return businessPlaceAPI
      .fetchBusinessPlaces(rootState.admin.clients.clients)
      .then((response) => {
        const tree = makeTree(rootState.admin.clients.clients, response);

        commit('SET_BUSINESS_PLACES', { tree, items: response.data });
        commit('SET_BUSINESS_PLACES_FETCHING_PROCESS', false);
      })
      .catch((error) => {
        commit('SET_BUSINESS_PLACES_ERROR', error);
        commit('SET_BUSINESS_PLACES_FETCHING_PROCESS', false);
      });
  },

  GET_BUSINESS_PLACES_INFO({ dispatch, rootState }) {
    if (Object.keys(rootState.admin.clients.clients).length === 0) {
      return dispatch('admin/clients/FETCH_CLIENTS_PROFILES', null, { root: true })
        .then(() => dispatch('FETCH_BUSINESS_PLACES'));
    }

    return dispatch('FETCH_BUSINESS_PLACES');
  },

  SYNC({ commit }, id) {
    commit('SET_SYNCING_PROCESS', true);

    return businessPlaceAPI.sync(id)
      .then(() => {
        commit('SET_SYNCING_PROCESS', false);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);

        commit('SET_SYNCING_PROCESS', false);
      });
  },

  ASSIGN_TO_USER({ commit }, { id, payload }) {
    commit('SET_ASSIGN_TO_USER_PROCESS', true);

    return businessPlaceAPI
      .assignToUser(id, payload)
      .then(() => {
        commit('SET_ASSIGN_TO_USER_PROCESS', false);
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);

        commit('SET_ASSIGN_TO_USER_PROCESS', false);
      });
  },
};
