export default {
  allApprovedAmounts(state) {
    return state.items
      .filter(item => item.isApproved)
      .map(item => item.amount);
  },

  agentBalance(state, getters) {
    return getters.allApprovedAmounts
      .reduce((prev, curr) => (prev * 100 + curr * 100) / 100, 0);
  },

  agentEarned(state, getters) {
    return getters.allApprovedAmounts
      .filter(item => item > 0)
      .reduce((prev, curr) => (prev * 100 + curr * 100) / 100, 0);
  },
};
