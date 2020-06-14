import createStore from "@/store";
import getStoreFieldByKeys from "@/utils/helpers/get-store-field-by-keys";

const store = createStore();

export default keys => () => {
  const field = getStoreFieldByKeys(store.state, keys);

  return (
    field.indexOf("required-id") === -1 &&
    field.indexOf("required-field-name") === -1 &&
    field.indexOf("permission-denied") === -1
  );
};
