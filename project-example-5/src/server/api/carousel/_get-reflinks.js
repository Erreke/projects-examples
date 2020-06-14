module.exports = function getReflinks(snapshot) {
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
};
