export default function clearError(errors, key) {
  const result = [];

  const replacer = (match, p1, p2) => [p1, p2.toLowerCase()].join('-');
  const snakeCasedKey = key.replace(/(.+?)([A-Z])/g, replacer);

  errors.forEach((error) => {
    if (!error.includes(snakeCasedKey)) {
      result.push(error);
    }
  });

  return result;
}
