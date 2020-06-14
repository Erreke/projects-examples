/* eslint-disable max-len */
import businessPlaceAPI from '@/api/business-place';

let unsubFromBusinessPlaces;

export default function subscribeToFirestore(store) {
  function updateBusinessPlaces(payload) {
    store.commit('business-place/SET_USER_BUSINESS_PLACES', payload);
  }

  store.subscribe((mutation) => {
    if (mutation.type === 'business-place/SET_USER_BUSINESS_PLACES') {
      if (!unsubFromBusinessPlaces) {
        unsubFromBusinessPlaces = businessPlaceAPI.subscribeToUserBusinessPlacesChanges(mutation.payload.uid, updateBusinessPlaces);
      }
    }

    if (mutation.type === 'user/RESET_STATE') {
      if (unsubFromBusinessPlaces && typeof unsubFromBusinessPlaces === 'function') {
        unsubFromBusinessPlaces();
      }
    }
  });
}
