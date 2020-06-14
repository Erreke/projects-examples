function clientFinances(finances, uid) {
  return finances
    .filter(item => item.uid === uid)
    .sort((a, b) => a.createdAt.seconds - b.createdAt.seconds);
}

function clientBalance(finances) {
  return finances
    .filter(item => item.isApproved)
    .map(item => item.amount)
    .reduce((prev, curr) => (prev * 100 + curr * 100) / 100, 0);
}

function clientCashbacks(finances) {
  const result = {
    is20Accrued: false,
    is30Accrued: false,
    is40Accrued: false,
    summ: 0,
  };

  finances.forEach((item) => {
    if (item.isCashback && item.isApproved) {
      if (item.amount === 20) {
        result.is20Accrued = true;
        result.summ += 20;
      }

      if (item.amount === 30) {
        result.is30Accrued = true;
        result.summ += 30;
      }

      if (item.amount === 40) {
        result.is40Accrued = true;
        result.summ += 40;
      }
    }
  });

  return result;
}

function clientWithdrawals(finances) {
  const result = {
    items: [],
    summ: 0,
  };

  result.items = finances.filter(item => item.isWithdrawal && !item.isApproved && !item.isRejected);
  result.summ = result.items
    .map(item => item.amount)
    .reduce((prev, curr) => (prev * 100 + curr * 100) / 100, 0);

  return result;
}

export default {
  clientsFinances(state, getters, rootState, rootGetters) {
    return rootGetters['admin/clients/clientsAll'].map((client) => {
      const finances = clientFinances(state.finances, client.uid);

      return {
        ...client,
        finances,
        cashbacks: clientCashbacks(finances),
        balance: clientBalance(finances),
        withdrawals: clientWithdrawals(finances),
      };
    });
  },
};
