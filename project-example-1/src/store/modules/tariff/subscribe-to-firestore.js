/* eslint-disable max-len */
import tariffAPI from '@/api/tariff';

let unsub;

export default function subscribeToFirestore(store) {
  function updateTariffs(payload) {
    store.commit('tariff/SET_TARIFFS', payload);
  }

  store.subscribe((mutation) => {
    if (mutation.type === 'tariff/SET_TARIFFS') {
      if (!unsub) {
        unsub = tariffAPI.subscribeToUserTariffsChanges(mutation.payload.uid, updateTariffs);
      }
    }

    if (mutation.type === 'user/RESET_STATE') {
      if (unsub && typeof unsub === 'function') {
        unsub();
      }
    }
  });
}
