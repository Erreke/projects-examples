module.exports = function fixPhoneForAmoCRM(phone) {
  const rgx = /[\u002d\u0028\u0029\u0020]*/gi;
  let fixedPhone = phone.replace(rgx, '');

  if (fixedPhone.indexOf('+7') === 0) {
    fixedPhone = fixedPhone.substring(2);
  }

  if (fixedPhone.indexOf('8') === 0) {
    fixedPhone = fixedPhone.substring(1);
  }

  return fixedPhone;
};
