import state from './state';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

import subscribeToFirestore from './subscribe-to-firestore';

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
  plugins: [subscribeToFirestore],
};
