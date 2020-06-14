import profileAPI from '@/api/profile';

export default function uniqueNickname(value, others) {
  if (value === '') return true;
  if (value === others.ownNickname) return true;

  const result = profileAPI.isUniqueNickname(value)
    .then(response => response)
    // eslint-disable-next-line no-console
    .catch(e => console.error(e));

  return result;
}
