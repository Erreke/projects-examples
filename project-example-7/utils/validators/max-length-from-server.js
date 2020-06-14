import { helpers } from 'vuelidate/lib/validators';
import createStore from '@/store';
import getStoreFieldByKeys from '@/utils/helpers/get-store-field-by-keys';

const store = createStore();

export default (input, keys, max) => helpers.withParams(
  { type: 'maxLengthFromServer', max },
  () => {
    const field = getStoreFieldByKeys(store.state, keys);

    return field.indexOf(`invalid-${input}-maximum-length`) === -1;
  },
);
