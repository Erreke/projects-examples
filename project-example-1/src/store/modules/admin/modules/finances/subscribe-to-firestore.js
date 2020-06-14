/* eslint-disable max-len */
import financesAPI from '@/api/admin/finances';

let unsubFromFinancesChanges;

export default function subscribeToFirestore(store) {
  function updateClientsData(payload) {
    store.commit('admin/finances/SET_FINANCES', payload);
  }

  store.subscribe((mutation) => {
    if (mutation.type === 'admin/finances/SET_FINANCES') {
      if (!unsubFromFinancesChanges) {
        unsubFromFinancesChanges = financesAPI.subscribeToClientsAllFinancesChanges(updateClientsData);
      }
    }

    if (mutation.type === 'user/RESET_STATE') {
      if (unsubFromFinancesChanges && typeof unsubFromFinancesChanges === 'function') {
        unsubFromFinancesChanges();
      }
    }
  });
}
