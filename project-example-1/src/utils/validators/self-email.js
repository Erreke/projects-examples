import createStore from '@/store';

const store = createStore();

export default function beneficiarEmail(value) {
  if (value === '') return true;

  return store.state.user.profile.email !== value;
}
