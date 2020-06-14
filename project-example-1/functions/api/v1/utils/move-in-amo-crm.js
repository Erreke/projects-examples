const AmoCrm = require('./amocrm');

module.exports = function sendToAmoCRM(name, email, phone, city) {
  const cities = {
    almaty: 'Алматы',
    other: 'Другое',
  };

  const citytag = cities[city] || 'Не определен';

  const config = {
    project: '',
    userLogin: '',
    userHash: '',
    data: {
      name,
      email,
      phone,
    },
    city,
    note: 'Хочу на вебинар',
    contactTags: [
      'на вебинар',
      `город: ${citytag}`,
    ],
    newLeadName: name,
    leadTags: [
      'на вебинар',
      `город: ${citytag}`,
    ],
    pipelineIds: {
      almaty:2220133 ,                   // Вебинар
      other: 2220133,                    // Вебинар
    },
    statusIds: {
      almaty: 31190359,                  // ЗАПИСАЛИСЬ на вебинар
      other: 31190359,                   // ЗАПИСАЛИСЬ на вебинар
    },
    searchPipelineIds: [
      2220133,                           // Вебинар
      1628350,                           // WhatsApp ЛИДЫ
      1606876,                           // Отдел продаж
    ],
    alreadyClientsPipelineId: 2024275,   // Действующие клиенты
    duplicatesPipelineId: 2001109,       // ДУБЛИ
  };

  const amo = new AmoCrm(config);

  return amo
    .moveToStatus()
    .then(response => response);
};
