function getTexts(state, item) {
  const rgx = /[\u002d\u0028\u0029\u0020\u002B]*/gi;
  const normalizedPhone = state.meta.phone.replace(rgx, '');
  const textToBot = state.meta.textToBot.replace('{number}', item.number);
  const textForCopy = state.meta.textFromBot.replace('{link}', item.reflink);
  const textFromBot = textForCopy.replace(/\n/g, '<br>');

  return {
    linkToBot: encodeURI(`https://wa.me/${normalizedPhone}?text=${textToBot}`),
    textForCopy,
    textFromBot,
  };
}

function getLinks(state, manager) {
  return state.reflinks
    .filter(item => item.manager === manager)
    .sort((a, b) => a.number - b.number)
    .map((item) => {
      const { linkToBot, textForCopy, textFromBot } = getTexts(state, item);

      return {
        ...item,
        linkToBot,
        textForCopy,
        textFromBot,
      };
    });
}

export default {
  hanRefLinks(state) {
    return getLinks(state, 'han');
  },

  mariaRefLinks(state) {
    return getLinks(state, 'maria');
  },

  stanislavRefLinks(state) {
    return getLinks(state, 'stanislav');
  },

  annaRefLinks(state) {
    return getLinks(state, 'anna');
  },

  madinaRefLinks(state) {
    return getLinks(state, 'madina');
  },

  paulRefLinks(state) {
    return getLinks(state, 'paul');
  },

  muhaRefLinks(state) {
    return getLinks(state, 'muha');
  },

  juliaRefLinks(state) {
    return getLinks(state, 'julia');
  },

  alinaRefLinks(state) {
    return getLinks(state, 'alina');
  },
};
