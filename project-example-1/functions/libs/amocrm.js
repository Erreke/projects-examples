const qs = require('qs');
const axios = require('axios');
const config = require('../settings/amocrm-config.json');

class amocrm {
  constructor() {
    this.isAuth = null;
    this.cookies = null;
    this.customFields = null;

    axios.defaults.baseURL = `https://${config.project}.amocrm.ru`;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  isAuthorised() {
    console.log('===------ isAuthorised ------>>>');
    console.log('this.isAuth:', this.isAuth);
    console.log('this.cookies:', this.cookies);
    console.log('<<<------ isAuthorised ------===');

    return !!this.isAuth && !!this.cookies;
  }

  async auth() {
    console.log('===------ auth ------>>>');

    const isAuth = await axios
      .post(
        '/private/api/auth.php?type=json',
        qs.stringify({
          USER_LOGIN: config.login,
          USER_HASH: config.hash
        })
      )
      .then(response => {
        if (response.status === 200 && response.data.response.auth) {
          this.cookies = response.headers['set-cookie'][0];

          return true;
        }

        throw new Error('unable-auth');
      });

    this.isAuth = isAuth;

    console.log('isAuth:', isAuth);
    console.log('<<<------ auth ------===');
  }

  async getLeadById(id) {
    if (!this.isAuthorised()) await this.auth();

    return await axios
      .get('/api/v2/leads', {
        headers: {
          cookie: this.cookies,
        },
        params: {
          id,
        },
      })
      .then(response => {
        if (response.status === 200 && response.data && response.data._embedded && response.data._embedded.items) {
          return response.data._embedded.items[0];
        }

        throw new Error('lead-not-found');
      });
  }

  async getLeadByPhone(phone) {
    console.log('===------ getLeadByPhone ------>>>');

    if (!this.isAuthorised()) await this.auth();

    console.log('object');

    const lead = await axios
      .get('/api/v2/leads', {
        headers: {
          cookie: this.cookies,
        },
        params: {
          query: phone,
        },
      })
      .then(response => {
        if (response.status === 200 && response.data && response.data._embedded && response.data._embedded.items) {
          return response.data._embedded.items[0];
        }

        throw new Error('lead-not-found');
      });

    console.log('lead:', lead);
    console.log('<<<------ getLeadByPhone ------===');

    return lead;
  }

  async getContactById(id) {
    if (!this.isAuthorised()) await this.auth();

    return axios
      .get('/api/v2/contacts', {
        headers: {
          cookie: this.cookies,
        },
        params: {
          id,
        },
      })
      .then(response => {
        if (response.status === 200 && response.data && response.data._embedded && response.data._embedded.items) {
          return response.data._embedded.items[0];
        }

        throw new Error('contact-not-found');
      });
  }

  async getContactPhoneByLeadId(id) {
    if (!this.isAuthorised()) await this.auth();

    const lead = await this.getLeadById(id);
    const contact = await this.getContactById(lead.main_contact.id);
    const values = contact.custom_fields[0].values;
    const phone = values.find(item => item.enum === config.phoneEmunId);

    return `+${phone.value}`;
  }
}

module.exports = amocrm;
