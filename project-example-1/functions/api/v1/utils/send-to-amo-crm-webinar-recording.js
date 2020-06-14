const AmoCrm = require('./amocrm');

module.exports = function sendToAmoCRM(name, email, phone) {
  const config = {
    project: '',
    userLogin: '',
    userHash: '',
    data: {
      name,
      email,
      phone
    },
    city: 'other',
    note: 'Был на вебинаре',
    contactTags: ['Из формы webinar'],
    newLeadName: name,
    leadTags: ['Из формы webinar'],
    pipelineIds: {
      other: 2220133,   // Вебинар
    },
    statusIds: {
      other: 31039081,  // ЗАПИСАЛИСЬ на вебинар
    },
  };

  const amo = new AmoCrm(config);

  return amo
    .send()
    .then(response => response);
};
