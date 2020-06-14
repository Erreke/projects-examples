import { LETTERS_AND_DIACRITICS } from "@/config";

export default function i18nAlpha(value) {
  if (value === "") return true;

  const matchLetterPattern = `^[${LETTERS_AND_DIACRITICS}]*$`;
  const rx = new RegExp(matchLetterPattern, "gim");

  return rx.test(value);
}
