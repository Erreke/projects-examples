/* eslint-disable max-len */
import tariffAPI from '@/api/admin/tariff';

let unsub;

export default function subscribeToFirestore(store) {
  function updateData(payload) {
    store.commit('admin/tariff/SET_ALL_TARIFF', payload);
  }

  store.subscribe((mutation) => {
    if (mutation.type === 'admin/tariff/SET_ALL_TARIFF') {
      if (!unsub) {
        unsub = tariffAPI.subscribeToAllTariffChanges(updateData);
      }
    }

    if (mutation.type === 'user/RESET_STATE') {
      if (unsub && typeof unsub === 'function') {
        unsub();
      }
    }
  });
}
