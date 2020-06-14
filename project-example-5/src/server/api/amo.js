import AmoCRM from 'AmoCRM';

const amoClient = new AmoCRM();

export default {
  sendToAmoCRM(firstName, secondName, phone, whatsapp, email, city, comment) {
    return amoClient
      .sendToAmo(firstName, secondName, phone, whatsapp, email, city, comment);
  },
};
