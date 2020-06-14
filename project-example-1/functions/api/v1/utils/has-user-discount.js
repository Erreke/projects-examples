module.exports = function hasUserDiscount(profileCreatedAt, deadline) {
  let deadlineInMill;
  const now = Date.now();

  if (deadline * 1000 > now) {
    deadlineInMill = deadline * 1000;
  }

  deadlineInMill = profileCreatedAt * 1000 + (72 * 60 * 60 * 1000);

  return deadlineInMill > now;
}