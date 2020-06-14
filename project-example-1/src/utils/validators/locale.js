import { VALID_LOCALE_REGEX } from '@/config';

export default function locale(value) {
  if (value === '') return true;

  const rx = new RegExp(VALID_LOCALE_REGEX, 'gim');

  return rx.test(value);
}
