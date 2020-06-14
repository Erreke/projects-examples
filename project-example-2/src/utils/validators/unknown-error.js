import createStore from "@/store";
import getStoreFieldByKeys from "@/utils/helpers/get-store-field-by-keys";

const store = createStore();

export default keys => () => {
  const field = getStoreFieldByKeys(store.state, keys);

  return field.indexOf("unknown-error") === -1;
};
