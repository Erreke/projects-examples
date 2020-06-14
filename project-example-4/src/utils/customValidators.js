import { FULLNAME_SYMBOLS, PHONE_NUMBER_SYMBOLS } from "@/config";

export function fullname(value) {
  if (value === "") return true;

  const matchLetterPattern = `^[${FULLNAME_SYMBOLS}]*$`;
  const rx = new RegExp(matchLetterPattern, "gim");

  return rx.test(value);
}

export function phone(value) {
  if (value === "") return true;

  const matchLetterPattern = `^[${PHONE_NUMBER_SYMBOLS}]*$`;
  const rx = new RegExp(matchLetterPattern, "gim");

  return rx.test(value);
}
