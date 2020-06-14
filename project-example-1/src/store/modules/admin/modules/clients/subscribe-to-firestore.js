/* eslint-disable max-len */
import clientsAPI from '@/api/admin/clients';

let unsubFromClientsChanges;
let unsubFromDiscountsChanges;

export default function subscribeToFirestore(store) {
  function updateClientsData(payload) {
    store.commit('admin/clients/SET_CLIENTS_PROFILES', payload);
  }

  function updateDiscountsData(payload) {
    store.commit('admin/clients/SET_CLIENTS_DISCOUNTS', payload);
  }

  store.subscribe((mutation) => {
    if (mutation.type === 'admin/clients/SET_CLIENTS_PROFILES') {
      if (!mutation.payload.isAdmin && !unsubFromClientsChanges) {
        unsubFromClientsChanges = clientsAPI.subscribeToAllClientsDataChanges(updateClientsData);
      }
    }

    if (mutation.type === 'admin/clients/SET_CLIENTS_DISCOUNTS') {
      if (!mutation.payload.isAdmin && !unsubFromDiscountsChanges) {
        unsubFromDiscountsChanges = clientsAPI.subscribeToDiscountsChanges(updateDiscountsData);
      }
    }

    if (mutation.type === 'user/RESET_STATE') {
      if (unsubFromClientsChanges && typeof unsubFromClientsChanges === 'function') {
        unsubFromClientsChanges();
      }

      if (unsubFromDiscountsChanges && typeof unsubFromDiscountsChanges === 'function') {
        unsubFromDiscountsChanges();
      }
    }
  });
}
