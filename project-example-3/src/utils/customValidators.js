import { LETTERS_AND_DIACRITICS_REGEX, PHONE_NUMBER_REGEX } from "@/config";

export function i18nAlpha(value) {
  if (value === "") return true;

  const matchLetterPattern = `^[${LETTERS_AND_DIACRITICS_REGEX}]*$`;
  const rx = new RegExp(matchLetterPattern, "gim");

  return rx.test(value);
}

export function phone(value) {
  if (value === "") return true;

  const matchLetterPattern = `^[${PHONE_NUMBER_REGEX}]*$`;
  const rx = new RegExp(matchLetterPattern, "gim");

  return rx.test(value);
}
