import { DateTime } from "luxon";

export default function(value) {
  if (!value) return "";

  if (typeof value === "number") {
    return DateTime.fromSeconds(value).toLocaleString(DateTime.DATETIME_MED);
  }

  if (typeof value === "object") {
    return DateTime.fromJSDate(value).toLocaleString(DateTime.DATETIME_MED);
  }

  return value;
}
