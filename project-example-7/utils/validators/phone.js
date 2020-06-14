import { PHONE_SYMBOLS } from '@/config';

export default function phone(value) {
  if (value === '') return true;

  const matchLetterPattern = `^[${PHONE_SYMBOLS}]*$`;
  const rx = new RegExp(matchLetterPattern, 'gim');

  return rx.test(value);
}
