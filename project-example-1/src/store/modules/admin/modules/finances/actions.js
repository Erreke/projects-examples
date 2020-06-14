import clientsAPI from '@/api/admin/clients';
import financesAPI from '@/api/admin/finances';

export default {
  FETCH_FINANCES_AND_CLIENTS({ rootState, commit }) {
    commit('SET_LOADING', true);

    const promises = [];
    const commits = [];

    if (Object.keys(rootState.admin.clients.clients).length === 0) {
      promises.push(clientsAPI.fetchClientsProfiles());
      commits.push('admin/clients/SET_CLIENTS_PROFILES');
    }

    if (rootState.admin.finances.finances.length === 0) {
      promises.push(financesAPI.fetchClientsAllFinances());
      commits.push('admin/finances/SET_FINANCES');
    }

    if (promises.length === 0) {
      commit('SET_LOADING', false);
      return Promise.resolve(true);
    }

    return Promise.all(promises)
      .then((response) => {
        commit(commits[0], response[0], { root: true });

        if (response.length === 2) {
          commit(commits[1], response[1], { root: true });
        }

        commit('SET_LOADING', false);
      });
  },

  ADD_CASHBACK(context, { uid, amount }) {
    return financesAPI.addCashback(uid, amount);
  },

  APPROVE_CLIENT_WITHDRAWAL(context, { id }) {
    return financesAPI.approveClientWithdrawal(id);
  },

  REJECT_CLIENT_WITHDRAWAL(context, { id, reason }) {
    return financesAPI.rejectClientWithdrawal(id, reason);
  },

  UNAPPROVE_CLIENT_WITHDRAWAL(context, { id }) {
    return financesAPI.unapproveClientWithdrawal(id);
  },

  UNREJECT_CLIENT_WITHDRAWAL(context, { id }) {
    return financesAPI.unrejectClientWithdrawal(id);
  },

  DELETE_CLIENT_OPERATION(context, { id }) {
    return financesAPI.deleteClientOperation(id);
  },
};
