export default function cardNumber(value) {
  if (value === "") return true;

  const rx = new RegExp(/(\d{4} ){4}/, "gim");

  return rx.test(`${value} `);
}
