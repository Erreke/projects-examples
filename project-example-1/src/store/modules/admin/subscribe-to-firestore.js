/* eslint-disable max-len */
import businessPlaceAPI from '@/api/admin/business-place';
import marketingIndicatorsAPI from '@/api/admin/marketing-indicators';
import makeTree from '@/store/helpers/make-tree';

let unsubFromBusinessPlacesChanges;
let unsubFromGrowthIndicators;
let unsubFromGenderIndicators;
let unsubFromAgeIndicators;
let unsubFromGeoIndicators;
let unsubFromGeoCities;

export default function subscribeToFirestore(store) {
  function updateBusinessPlacesData(payload) {
    const tree = makeTree(store.state.admin.clients.clients, payload);

    store.commit('admin/business-places/SET_BUSINESS_PLACES', { tree, items: payload.data });
  }

  function updateGrowthIndicators(payload) {
    store.commit('admin/marketing-indicators/SET_GROWTH_INDICATORS', payload);
  }

  function updateGenderIndicators(payload) {
    store.commit('admin/marketing-indicators/SET_GENDER_INDICATORS', payload);
  }

  function updateAgeIndicators(payload) {
    store.commit('admin/marketing-indicators/SET_AGE_INDICATORS', payload);
  }

  function updateGeoIndicators(payload) {
    store.commit('admin/marketing-indicators/SET_GEO_INDICATORS', payload);
  }

  function updateGeoCities(payload) {
    store.commit('admin/marketing-indicators/SET_GEO_CITIES', payload);
  }

  store.subscribe((mutation) => {
    if (mutation.type === 'admin/business-places/SET_BUSINESS_PLACES') {
      if (!unsubFromBusinessPlacesChanges) {
        unsubFromBusinessPlacesChanges = businessPlaceAPI.subscribeToBusinessPlacesChanges(updateBusinessPlacesData, store.state.admin.clients.clients);
      }
    }

    if (mutation.type === 'admin/marketing-indicators/SET_GROWTH_INDICATORS') {
      if (!unsubFromGrowthIndicators) {
        unsubFromGrowthIndicators = marketingIndicatorsAPI.subscribeToGrowthChanges(updateGrowthIndicators);
      }
    }

    if (mutation.type === 'admin/marketing-indicators/SET_GENDER_INDICATORS') {
      if (!unsubFromGenderIndicators) {
        unsubFromGenderIndicators = marketingIndicatorsAPI.subscribeToGenderChanges(updateGenderIndicators);
      }
    }

    if (mutation.type === 'admin/marketing-indicators/SET_AGE_INDICATORS') {
      if (!unsubFromAgeIndicators) {
        unsubFromAgeIndicators = marketingIndicatorsAPI.subscribeToAgeChanges(updateAgeIndicators);
      }
    }

    if (mutation.type === 'admin/marketing-indicators/SET_GEO_INDICATORS') {
      if (!unsubFromGeoIndicators) {
        unsubFromGeoIndicators = marketingIndicatorsAPI.subscribeToGeoIndicatorsChanges(updateGeoIndicators);
      }
    }

    if (mutation.type === 'admin/marketing-indicators/SET_GEO_CITIES') {
      if (!unsubFromGeoCities) {
        unsubFromGeoCities = marketingIndicatorsAPI.subscribeToGeoCitiesChanges(updateGeoCities);
      }
    }

    if (mutation.type === 'user/RESET_STATE') {
      if (unsubFromBusinessPlacesChanges && typeof unsubFromBusinessPlacesChanges === 'function') {
        unsubFromBusinessPlacesChanges();
      }

      if (unsubFromGrowthIndicators && typeof unsubFromGrowthIndicators === 'function') {
        unsubFromGrowthIndicators();
      }

      if (unsubFromGenderIndicators && typeof unsubFromGenderIndicators === 'function') {
        unsubFromGenderIndicators();
      }

      if (unsubFromAgeIndicators && typeof unsubFromAgeIndicators === 'function') {
        unsubFromAgeIndicators();
      }

      if (unsubFromGeoIndicators && typeof unsubFromGeoIndicators === 'function') {
        unsubFromGeoIndicators();
      }

      if (unsubFromGeoCities && typeof unsubFromGeoCities === 'function') {
        unsubFromGeoCities();
      }
    }
  });
}
