export default function weakPassword(value) {
  if (!value) return true;

  // eslint-disable-next-line no-useless-escape
  const rx = new RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&,*+-=.])(?=.{6,})/,
    "gim"
  );

  return rx.test(value);
}
