const amocrm = require('../libs/amocrm');

const amoClient = new amocrm();

module.exports = async function(phone) {
  try {
    return !!(await amoClient.getLeadByPhone(phone));
  } catch (e) {
    if (e.message === 'lead-not-found') {
      return false
    }

    throw new Error(e.message);
  }
};
