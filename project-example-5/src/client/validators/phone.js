export default function phone(value) {
  if (value === '') return true;

  if (value.length < 12) return false;

  const rx = /^[+]+[0-9]{1,4}[-\s]*[(]{0,1}[0-9]{1,5}[)]{0,1}[-\s/0-9]*$/g;

  return rx.test(value);
}
