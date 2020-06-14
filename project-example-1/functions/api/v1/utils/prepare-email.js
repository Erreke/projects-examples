module.exports = function({ email, locale, templateId, data }) {
  return {
    templateId,
    email,
    data: {
      ...data,
      russian: locale === 'ru',
      english: locale === 'en',
    },
  };
};
