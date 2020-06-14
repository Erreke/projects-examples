module.exports = function getLinkToBot(meta, requestNumber) {
  const rgx = /[\u002d\u0028\u0029\u0020\u002B]*/gi;
  const normalizedPhone = meta.phone.replace(rgx, '');
  const textToBot = meta.textToBot.replace('{number}', requestNumber);

  return encodeURI(`https://wa.me/${normalizedPhone}?text=${textToBot}`);
};
