const { NICKNAME_SYMBOLS } = require('../../../config');

module.exports = function isValidNickname(nickname) {
  const matchLetterPattern = `^[${NICKNAME_SYMBOLS}]*$`;
  const rx = new RegExp(matchLetterPattern, 'gim');

  return rx.test(nickname);
}