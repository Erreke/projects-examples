import db from '@/utils/firebase/init';

function fetchGrowth() {
  return db
    .collection('marketing_indicators_growth')
    .orderBy('createdAt', 'desc')
    .limit(7)
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

function fetchGender() {
  return db
    .collection('marketing_indicators_gender')
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
    .then((snapshot) => {
      let indicator = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          indicator = {
            ...doc.data(),
          };
        });
      }

      return indicator;
    });
}

function fetchAge() {
  return db
    .collection('marketing_indicators_age')
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
    .then((snapshot) => {
      let indicator = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          indicator = {
            ...doc.data(),
          };
        });
      }

      return indicator;
    });
}

function fetchGeo() {
  return db
    .collection('marketing_indicators_geo')
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get()
    .then((snapshot) => {
      let indicator = {};

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          indicator = {
            ...doc.data(),
          };
        });
      }

      return indicator;
    });
}

export default {
  fetchGrowth,
  fetchGender,
  fetchAge,
  fetchGeo,
};
