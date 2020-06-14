export function tryJsonParse(str) {
  if (!str) return null;

  try {
    return JSON.parse(str);
  } catch (error) {
    return null;
  }
}
