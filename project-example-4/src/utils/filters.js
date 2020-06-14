import { DateTime } from "luxon";

export function TIME_SIMPLE(value) {
  if (!value) return "";

  return DateTime.fromSeconds(value).toLocaleString(DateTime.TIME_SIMPLE);
}

export function DATETIME_FULL(value) {
  if (!value) return "";

  return DateTime.fromSeconds(value).toLocaleString(DateTime.DATETIME_FULL);
}
