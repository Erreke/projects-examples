const AmoCrm = require('./amocrm');

module.exports = function sendToAmoCRM(name, phone) {
  const config = {
    project: '',
    userLogin: '',
    userHash: '',
    data: {
      name,
      email: '',
      phone
    },
    city: 'other',
    note: 'Хочу на вебинар',
    contactTags: ['Из главной'],
    newLeadName: name,
    leadTags: ['Из главной'],
    pipelineIds: {
      other: 2220133,   // Вебинар
    },
    statusIds: {
      other: 31190359,  // ЗАПИСАЛИСЬ на вебинар
    },
  };

  const amo = new AmoCrm(config);

  return amo
    .send()
    .then(response => response);
};
