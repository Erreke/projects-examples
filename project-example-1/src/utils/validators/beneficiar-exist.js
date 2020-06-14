import createStore from '@/store';

const store = createStore();

export default function beneficiarExist(value) {
  if (value === '') return true;

  if (!store.state.finance.beneficiarGettingError) return true;

  return store.state.finance.beneficiarGettingError !== 'USER_NOT_FOUND';
}
