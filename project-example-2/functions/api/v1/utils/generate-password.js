module.exports = () => {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const length = 8;
  let retVal = "";

  for (let i = 0, n = charset.length; i < length; i += 1) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
};
