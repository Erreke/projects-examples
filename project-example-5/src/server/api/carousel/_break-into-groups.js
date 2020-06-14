module.exports = function breakIntoGroups(reflinks) {
  return reflinks
    .sort((a, b) => a.number - b.number)
    .reduce((accum, item) => {
      const managerIndex = Math.floor(item.number / 100) - 1;

      if (!accum[managerIndex]) {
        accum.push([]);
      }

      accum[managerIndex].push(item.number);

      return accum;
    }, []);
};
