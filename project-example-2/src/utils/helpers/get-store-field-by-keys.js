export default function getStoreFieldByKeys(store, keys) {
  let currentField = store[keys[0]];

  for (let i = 1, len = keys.length; i < len; i += 1) {
    currentField = currentField[keys[i]];
  }

  return currentField;
}
