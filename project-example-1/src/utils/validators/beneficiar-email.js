import createStore from '@/store';

const store = createStore();

export default function beneficiarEmail(value) {
  if (value === '') return true;

  if (!store.state.finance.beneficiarGettingError) return true;

  return store.state.finance.beneficiarGettingError !== 'INVALID_EMAIL';
}
