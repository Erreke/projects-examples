import db from '@/utils/firebase/init';

function fetchGrowth() {
  return db
    .collection('marketing_indicators_growth')
    .orderBy('createdAt', 'asc')
    .limit(31)
    .get()
    .then((snapshot) => {
      const indicators = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.createdAt.seconds * 1000);

          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();

          const key = `${day}.${month}.${year}`;

          indicators[key] = {
            id: doc.id,
            day,
            month,
            year,
            value: data.value,
          };
        });
      }

      return indicators;
    });
}

function subscribeToGrowthChanges(callback) {
  return db
    .collection('marketing_indicators_growth')
    .orderBy('createdAt', 'asc')
    .limit(31)
    .onSnapshot((snapshot) => {
      const indicators = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.createdAt.seconds * 1000);

          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();

          const key = `${day}.${month}.${year}`;

          indicators[key] = {
            id: doc.id,
            day,
            month,
            year,
            date: data.createdAt.seconds || 0,
            value: data.value,
          };
        });
      }

      callback(indicators);
    });
}

function createGrowth(createdAt, value) {
  return db
    .collection('marketing_indicators_growth')
    .doc()
    .set({ createdAt, value });
}

function updateGrowth(id, value) {
  return db
    .collection('marketing_indicators_growth')
    .doc(id)
    .update({ value });
}

function deleteGrowth(id) {
  return db
    .collection('marketing_indicators_growth')
    .doc(id)
    .delete();
}


function fetchGender() {
  return db
    .collection('marketing_indicators_gender')
    .orderBy('createdAt', 'asc')
    .limit(31)
    .get()
    .then((snapshot) => {
      const indicators = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.createdAt.seconds * 1000);

          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const key = `${day}.${month}.${year}`;

          indicators[key] = {
            id: doc.id,
            ...data,
          };
        });
      }

      return indicators;
    });
}

function subscribeToGenderChanges(callback) {
  return db
    .collection('marketing_indicators_gender')
    .orderBy('createdAt', 'asc')
    .limit(31)
    .onSnapshot((snapshot) => {
      const indicators = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.createdAt.seconds * 1000);

          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const key = `${day}.${month}.${year}`;

          indicators[key] = {
            id: doc.id,
            ...data,
          };
        });
      }

      callback(indicators);
    });
}

function createGender(createdAt, male, female) {
  return db
    .collection('marketing_indicators_gender')
    .doc()
    .set({ createdAt, male, female });
}

function updateGender(id, male, female) {
  return db
    .collection('marketing_indicators_gender')
    .doc(id)
    .update({ male, female });
}

function deleteGender(id) {
  return db
    .collection('marketing_indicators_gender')
    .doc(id)
    .delete();
}


function fetchAge() {
  return db
    .collection('marketing_indicators_age')
    .orderBy('createdAt', 'asc')
    .limit(31)
    .get()
    .then((snapshot) => {
      const indicators = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.createdAt.seconds * 1000);

          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const key = `${day}.${month}.${year}`;

          indicators[key] = {
            id: doc.id,
            ...data,
          };
        });
      }

      return indicators;
    });
}

function subscribeToAgeChanges(callback) {
  return db
    .collection('marketing_indicators_age')
    .orderBy('createdAt', 'asc')
    .limit(31)
    .onSnapshot((snapshot) => {
      const indicators = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.createdAt.seconds * 1000);

          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const key = `${day}.${month}.${year}`;

          indicators[key] = {
            id: doc.id,
            ...data,
          };
        });
      }

      callback(indicators);
    });
}

function createAge({
  createdAt,
  under18,
  between1825,
  between2635,
  between3655,
  between5685,
  more85,
  unknownAge,
}) {
  return db
    .collection('marketing_indicators_age')
    .doc()
    .set({
      createdAt,
      under18,
      between1825,
      between2635,
      between3655,
      between5685,
      more85,
      unknownAge,
    });
}

function updateAge({
  id,
  under18,
  between1825,
  between2635,
  between3655,
  between5685,
  more85,
  unknownAge,
}) {
  return db
    .collection('marketing_indicators_age')
    .doc(id)
    .update({
      under18,
      between1825,
      between2635,
      between3655,
      between5685,
      more85,
      unknownAge,
    });
}

function deleteAge(id) {
  return db
    .collection('marketing_indicators_age')
    .doc(id)
    .delete();
}


function fetchGeoIndicators() {
  return db
    .collection('marketing_indicators_geo')
    .orderBy('createdAt', 'asc')
    .limit(31)
    .get()
    .then((snapshot) => {
      const indicators = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.createdAt.seconds * 1000);

          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const key = `${day}.${month}.${year}`;

          indicators[key] = {
            id: doc.id,
            ...data,
          };
        });
      }

      return indicators;
    });
}

function subscribeToGeoIndicatorsChanges(callback) {
  return db
    .collection('marketing_indicators_geo')
    .orderBy('createdAt', 'asc')
    .limit(31)
    .onSnapshot((snapshot) => {
      const indicators = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          const data = doc.data();
          const date = new Date(data.createdAt.seconds * 1000);

          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const key = `${day}.${month}.${year}`;

          indicators[key] = {
            id: doc.id,
            ...data,
          };
        });
      }

      callback(indicators);
    });
}

function createGeoIndicators(createdAt, keys, values) {
  return db
    .collection('marketing_indicators_geo')
    .doc()
    .set({ createdAt, keys, values });
}

function updateGeoIndicators(id, keys, values) {
  return db
    .collection('marketing_indicators_geo')
    .doc(id)
    .update({ keys, values });
}

function deleteGeoIndicators(id) {
  return db
    .collection('marketing_indicators_geo')
    .doc(id)
    .delete();
}


function fetchGeoCities() {
  return db
    .collection('marketing_indicators_geo_cities')
    .orderBy('countryCity', 'asc')
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        return snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
      }

      return [];
    });
}

function subscribeToGeoCitiesChanges(callback) {
  return db
    .collection('marketing_indicators_geo_cities')
    .orderBy('countryCity', 'asc')
    .onSnapshot((snapshot) => {
      if (!snapshot.empty) {
        callback(snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })));
      } else {
        callback([]);
      }
    });
}

function createGeoCity(payload) {
  return db
    .collection('marketing_indicators_geo_cities')
    .doc()
    .set(payload);
}

function updateGeoCity(id, payload) {
  return db
    .collection('marketing_indicators_geo_cities')
    .doc(id)
    .update(payload);
}

function deleteGeoCity(id) {
  return db
    .collection('marketing_indicators_geo_cities')
    .doc(id)
    .delete();
}

export default {
  fetchGrowth,
  subscribeToGrowthChanges,
  createGrowth,
  updateGrowth,
  deleteGrowth,

  fetchGender,
  subscribeToGenderChanges,
  createGender,
  updateGender,
  deleteGender,

  fetchAge,
  subscribeToAgeChanges,
  createAge,
  updateAge,
  deleteAge,

  fetchGeoIndicators,
  subscribeToGeoIndicatorsChanges,
  createGeoIndicators,
  updateGeoIndicators,
  deleteGeoIndicators,

  fetchGeoCities,
  subscribeToGeoCitiesChanges,
  createGeoCity,
  updateGeoCity,
  deleteGeoCity,
};
