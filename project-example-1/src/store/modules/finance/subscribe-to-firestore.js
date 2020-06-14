/* eslint-disable max-len */
import financeAPI from '@/api/finance';

let unsubFromFinances;

export default function subscribeToFirestore(store) {
  function updateFinances(payload) {
    store.commit('finance/SET_FINANCES', payload);
  }

  store.subscribe((mutation) => {
    if (mutation.type === 'finance/SET_FINANCES') {
      if (!unsubFromFinances) {
        unsubFromFinances = financeAPI.subscribeToFinancesChanges(mutation.payload.uid, updateFinances);
      }
    }

    if (mutation.type === 'user/RESET_STATE') {
      if (unsubFromFinances && typeof unsubFromFinances === 'function') {
        unsubFromFinances();
      }
    }
  });
}
