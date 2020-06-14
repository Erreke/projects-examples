import { LINK_SYMBOLS } from "@/config";

export default function nickname(value) {
  if (value === "") return true;

  const matchLetterPattern = `^[${LINK_SYMBOLS}]*$`;
  const rx = new RegExp(matchLetterPattern, "gim");

  return rx.test(value);
}
