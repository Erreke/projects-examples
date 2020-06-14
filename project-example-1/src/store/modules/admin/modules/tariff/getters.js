export default {
  ordersWithClients(state, getters, rootState, rootGetters) {
    return state.items.map(item => ({
      ...item,
      client: rootGetters['admin/clients/clientsAll'].find(client => item.uid === client.uid),
    }));
  },
};
