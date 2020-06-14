import db from '@/utils/firebase/init';

function fetchCarouselMeta() {
  return db
    .collection('carousel_meta')
    .doc('meta')
    .get()
    .then((doc) => {
      if (doc.exists) {
        return doc.data();
      }

      return {};
    });
}

function fetchCarouselReflinks() {
  return db
    .collection('carousel_reflinks')
    .get()
    .then((snapshot) => {
      const items = [];

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      }

      return items;
    });
}

function fetchCarouselFinalLinks() {
  return db
    .collection('carousel_finallinks')
    .get()
    .then((snapshot) => {
      const items = [];

      if (!snapshot.empty) {
        snapshot.forEach((doc) => {
          items.push({
            id: doc.id,
            ...doc.data(),
          });
        });
      }

      return items;
    });
}

function saveCarouselMeta(meta) {
  return db
    .collection('carousel_meta')
    .doc('meta')
    .update(meta);
}

function saveCarouselReflink(payload) {
  const batch = db.batch();

  Object.keys(payload).forEach((id) => {
    const docRef = db.collection('carousel_reflinks').doc(id);
    batch.update(docRef, {
      ...payload[id],
    });
  });

  return batch.commit();
}

function deleteCarouselReflink(id) {
  return db
    .collection('carousel_reflinks')
    .doc(id)
    .delete();
}

function addCarouselReflink(payload) {
  return db
    .collection('carousel_reflinks')
    .doc()
    .set(payload);
}

export default {
  fetchCarouselMeta,
  fetchCarouselReflinks,
  fetchCarouselFinalLinks,
  saveCarouselMeta,
  saveCarouselReflink,
  deleteCarouselReflink,
  addCarouselReflink,
};
