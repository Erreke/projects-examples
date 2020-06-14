const { db } = require('../admin');

async function getParent(bpid, parents) {
  return db.collection('business_places')
    .doc(bpid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const { parent } = doc.data();

        if (parent) {
          parents.push(parent);

          return getParent(parent, parents);
        }

        return false;
      }

      return false;
    });
}

function createArray() {
  return [];
}

module.exports = async function getAllParentsById(bpid) {
  const parents = createArray();

  parents.push(bpid);

  await getParent(bpid, parents);

  return parents;
};
