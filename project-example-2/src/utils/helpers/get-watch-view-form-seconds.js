function padByZero(val) {
  const valString = `${val}`;

  if (valString.length < 2) {
    return `0${valString}`;
  }

  return valString;
}

export default function getWatchViewFormSeconds(duration) {
  let leftSeconds = duration;

  const secondsInSeconds = 1;
  const secondsInMinutes = 60 * secondsInSeconds;
  const secondsInHours = 60 * secondsInMinutes;
  const secondsInDay = 24 * secondsInHours;

  const days = padByZero(parseInt(leftSeconds / secondsInDay, 10));
  leftSeconds = leftSeconds - days * secondsInDay;

  const hours = padByZero(parseInt(leftSeconds / secondsInHours, 10));
  leftSeconds = leftSeconds - hours * secondsInHours;

  // eslint-disable-next-line prettier/prettier
  const minutes = padByZero(parseInt(leftSeconds / secondsInMinutes, 10));
  leftSeconds = leftSeconds - minutes * secondsInMinutes;

  // eslint-disable-next-line prettier/prettier
  const seconds = padByZero(parseInt(leftSeconds / secondsInSeconds, 10));

  return [days, hours, minutes, seconds];
}
