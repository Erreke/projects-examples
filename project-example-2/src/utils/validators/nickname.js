import { NICKNAME_SYMBOLS } from "@/config";

export default function nickname(value) {
  if (value === "") return true;

  const matchLetterPattern = `^[${NICKNAME_SYMBOLS}]*$`;
  const rx = new RegExp(matchLetterPattern, "gim");

  return rx.test(value);
}
