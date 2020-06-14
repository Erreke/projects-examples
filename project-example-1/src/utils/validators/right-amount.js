export default function rightAmount(value) {
  if (value === '') return true;

  const rx = new RegExp(/[\d\s,.]/, 'gim');

  return rx.test(value);
}
