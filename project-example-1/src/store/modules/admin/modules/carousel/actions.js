import carouselAPI from '@/api/admin/carousel';

export default {
  FETCH_CAROUSEL_META({ state, commit }) {
    commit('SET_CAROUSEL_META_FETCHING', true);

    if (Object.keys(state.meta).length === 0) {
      return carouselAPI
        .fetchCarouselMeta()
        .then((response) => {
          commit('SET_CAROUSEL_META_FETCHING_RESULT', response);
          commit('SET_CAROUSEL_META_FETCHING', false);
        })
        .catch((error) => {
          commit('SET_CAROUSEL_META_FETCHING_ERROR', error);
          commit('SET_CAROUSEL_META_FETCHING', false);
        });
    }

    commit('SET_CAROUSEL_META_FETCHING', false);
    return Promise.resolve(true);
  },

  FETCH_CAROUSEL_REFLINKS({ state, commit }) {
    commit('SET_CAROUSEL_REFLINKS_FETCHING', true);

    if (state.reflinks.length === 0) {
      return carouselAPI
        .fetchCarouselReflinks()
        .then((response) => {
          commit('SET_CAROUSEL_REFLINKS_FETCHING_RESULT', response);
          commit('SET_CAROUSEL_REFLINKS_FETCHING', false);
        })
        .catch((error) => {
          commit('SET_CAROUSEL_REFLINKS_FETCHING_ERROR', error);
          commit('SET_CAROUSEL_REFLINKS_FETCHING', false);
        });
    }

    commit('SET_CAROUSEL_REFLINKS_FETCHING', false);
    return Promise.resolve(true);
  },

  FETCH_CAROUSEL_FINALLINKS({ state, commit }) {
    commit('SET_CAROUSEL_FINALLINKS_FETCHING', true);

    if (state.finallinks.length === 0) {
      return carouselAPI
        .fetchCarouselFinalLinks()
        .then((response) => {
          commit('SET_CAROUSEL_FINALLINKS_FETCHING_RESULT', response);
          commit('SET_CAROUSEL_FINALLINKS_FETCHING', false);
        })
        .catch((error) => {
          commit('SET_CAROUSEL_FINALLINKS_FETCHING_ERROR', error);
          commit('SET_CAROUSEL_FINALLINKS_FETCHING', false);
        });
    }

    commit('SET_CAROUSEL_FINALLINKS_FETCHING', false);
    return Promise.resolve(true);
  },

  SAVE_CAROUSEL_META({ state, commit }) {
    commit('SET_CAROUSEL_META_SAVING', true);

    return carouselAPI
      .saveCarouselMeta(state.meta)
      .then((response) => {
        commit('SET_CAROUSEL_META_SAVING_RESULT', response);
        commit('SET_CAROUSEL_META_SAVING', false);
      })
      .catch((error) => {
        commit('SET_CAROUSEL_META_SAVING_ERROR', error);
        commit('SET_CAROUSEL_META_SAVING', false);
      });
  },

  SAVE_CAROUSEL_REFLINK({ commit }, payload) {
    commit('SET_CAROUSEL_REFLINK_SAVING', true);

    return carouselAPI
      .saveCarouselReflink(payload)
      .then(sresponse => carouselAPI
        .fetchCarouselReflinks()
        .then((fresponse) => {
          commit('SET_CAROUSEL_REFLINKS_FETCHING_RESULT', fresponse);
          commit('SET_CAROUSEL_REFLINK_SAVING_RESULT', sresponse);
          commit('SET_CAROUSEL_REFLINK_SAVING', false);
        }))
      .catch((error) => {
        commit('SET_CAROUSEL_REFLINK_SAVING_ERROR', error);
        commit('SET_CAROUSEL_REFLINK_SAVING', false);
      });
  },

  DELETE_CAROUSEL_REFLINK({ commit }, payload) {
    commit('SET_CAROUSEL_REFLINK_DELETING', true);

    return carouselAPI
      .deleteCarouselReflink(payload)
      .then(sresponse => carouselAPI
        .fetchCarouselReflinks()
        .then((fresponse) => {
          commit('SET_CAROUSEL_REFLINKS_FETCHING_RESULT', fresponse);
          commit('SET_CAROUSEL_REFLINK_DELETING_RESULT', sresponse);
          commit('SET_CAROUSEL_REFLINK_DELETING', false);
        }))
      .catch((error) => {
        commit('SET_CAROUSEL_REFLINK_DELETING_ERROR', error);
        commit('SET_CAROUSEL_REFLINK_DELETING', false);
      });
  },

  ADD_CAROUSEL_REFLINK({ commit }, payload) {
    commit('SET_CAROUSEL_REFLINK_ADDING', true);

    return carouselAPI
      .addCarouselReflink(payload)
      .then(sresponse => carouselAPI
        .fetchCarouselReflinks()
        .then((fresponse) => {
          commit('SET_CAROUSEL_REFLINKS_FETCHING_RESULT', fresponse);
          commit('SET_CAROUSEL_REFLINK_ADDING_RESULT', sresponse);
          commit('SET_CAROUSEL_REFLINK_ADDING', false);
        }))
      .catch((error) => {
        commit('SET_CAROUSEL_REFLINK_ADDING_ERROR', error);
        commit('SET_CAROUSEL_REFLINK_ADDING', false);
      });
  },
};
