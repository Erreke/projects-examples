import redirectsAPI from '@/api/admin/redirects';
import storageAPI from '@/api/admin/storage';

function createRedirect(redirect, commit) {
  return redirectsAPI.createRedirect(redirect)
    .then(() => {
      commit('SET_CREATE_OR_UPDATE_PROCESSING', false);
      commit('CLEAR_CREATE_OR_UPDATE_FORM');

      return true;
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error('error:', e);

      commit('SET_CREATING_ERROR', e);
      commit('SET_CREATE_OR_UPDATE_PROCESSING', false);

      return false;
    });
}

function updateRedirect(id, redirect, commit) {
  return redirectsAPI.updateRedirect(id, redirect)
    .then(() => {
      commit('SET_CREATE_OR_UPDATE_PROCESSING', false);
      commit('CLEAR_CREATE_OR_UPDATE_FORM');

      return true;
    })
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error('error:', e);

      commit('SET_UPDATING_ERROR', e);
      commit('SET_CREATE_OR_UPDATE_PROCESSING', false);

      return false;
    });
}

export default {
  CREATE_REDIRECT({ commit }, redirect) {
    commit('CLEAR_CREATING_ERROR');
    commit('SET_CREATE_OR_UPDATE_PROCESSING', true);

    if (redirect.type === 'file') {
      return storageAPI
        .uploadFile(redirect.file)
        .then((uploadedFileLink) => {
          // eslint-disable-next-line no-param-reassign
          delete redirect.isFileChanged;

          return createRedirect({
            ...redirect,
            redirectTo: uploadedFileLink,
            file: redirect.file.name,
          }, commit);
        });
    }

    if (redirect.type === 'whatsapp') {
      // eslint-disable-next-line no-param-reassign
      delete redirect.isFileChanged;

      return createRedirect({
        ...redirect,
        redirectTo: encodeURI(`https://api.whatsapp.com/send?phone=${redirect.phone}&text=${redirect.text}`),
      }, commit);
    }

    // eslint-disable-next-line no-param-reassign
    delete redirect.isFileChanged;

    return createRedirect(redirect, commit);
  },

  UPDATE_REDIRECT({ commit }, { id, redirect }) {
    commit('CLEAR_UPDATING_ERROR');
    commit('SET_CREATE_OR_UPDATE_PROCESSING', true);

    if (redirect.type === 'file' && redirect.isFileChanged) {
      return storageAPI
        .uploadFile(redirect.file)
        .then((uploadedFileLink) => {
          // eslint-disable-next-line no-param-reassign
          delete redirect.isFileChanged;

          return updateRedirect(id, {
            ...redirect,
            file: redirect.file.name,
            redirectTo: uploadedFileLink,
          }, commit);
        });
    }

    if (redirect.type === 'whatsapp') {
      // eslint-disable-next-line no-param-reassign
      delete redirect.isFileChanged;

      return updateRedirect(id, {
        ...redirect,
        redirectTo: encodeURI(`https://api.whatsapp.com/send?phone=${redirect.phone}&text=${redirect.text}`),
      }, commit);
    }

    // eslint-disable-next-line no-param-reassign
    delete redirect.isFileChanged;
    // eslint-disable-next-line no-param-reassign
    redirect.file = redirect.file.name;

    return updateRedirect(id, redirect, commit);
  },

  DELETE_REDIRECT({ commit }, id) {
    commit('CLEAR_DELETING_ERROR');
    commit('SET_DELETING_PROCESS', true);

    return redirectsAPI.deleteRedirect(id)
      .then(() => {
        commit('SET_DELETING_PROCESS', false);

        return true;
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('error:', e);

        commit('SET_DELETING_ERROR', e);
        commit('SET_DELETING_PROCESS', false);

        return false;
      });
  },

  RECOVER_REDIRECT(context, redirect) {
    const { id } = redirect;
    // eslint-disable-next-line no-param-reassign
    delete redirect.id;

    return redirectsAPI.recoverRedirect(id, redirect)
      .then(() => true)
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('error:', e);

        return false;
      });
  },

  FETCH_ALL_REDIRECTS_INFO({ commit }, name) {
    commit('CLEAR_ALL_REDIRECTS_INFO');
    commit('SET_ALL_REDIRECTS_INFO_PROCESSING', true);

    return redirectsAPI.fetchAllRedirectsInfo(name)
      .then((response) => {
        if (response) {
          commit('SET_ALL_REDIRECTS_INFO', response);
          commit('SET_ALL_REDIRECTS_INFO_PROCESSING', false);

          return true;
        }

        return false;
      })
      .catch((e) => {
        commit('SET_ALL_REDIRECTS_INFO_ERRORS', e.code);
        commit('SET_ALL_REDIRECTS_INFO_PROCESSING', false);

        return false;
      });
  },

  FETCH_AVAILABLE_PHONES({ commit }) {
    commit('CLEAR_AVAILABLE_PHONES_ERRORS');
    commit('SET_AVAILABLE_PHONES_PROCESSING', true);

    return redirectsAPI.fetchAvailablePhones()
      .then((response) => {
        if (response) {
          commit('SET_AVAILABLE_PHONES', response);
          commit('SET_AVAILABLE_PHONES_PROCESSING', false);

          return true;
        }

        return false;
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error('error:', e);

        commit('SET_AVAILABLE_PHONES_ERRORS', e);
        commit('SET_AVAILABLE_PHONES_PROCESSING', false);

        return false;
      });
  },
};
