import createStore from '@/store';
import getStoreFieldByKeys from '@/utils/helpers/get-store-field-by-keys';

const store = createStore();

export default (input, keys) => () => {
  const field = getStoreFieldByKeys(store.state, keys);

  return field.indexOf(`does-not-exist-${input}`) === -1;
};
