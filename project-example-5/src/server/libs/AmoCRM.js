/* eslint-disable max-len */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import qs from 'qs';
import axios from 'axios';
import config from 'amocrm-config';

function sortLeads(items) {
  return items.sort((a, b) => b.created_at - a.created_at);
}

export default class AmoCRM {
  constructor() {
    this.cookies = null;
    this.isAuth = null;
    this.customFields = null;
    this.contact = null;
    this.lead = null;

    axios.defaults.baseURL = `https://${config.project}.amocrm.ru`;
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
  }

  isAuthorised() {
    console.log('===------- isAuthorised ------->>>');
    console.log('this.isAuth:', this.isAuth);
    console.log('this.isAuth:', this.cookies);
    console.log('<<<------- isAuthorised -------===');

    return !!this.isAuth && !!this.cookies;
  }

  async auth() {
    try {
      this.isAuth = await axios
        .post(
          '/private/api/auth.php?type=json',
          qs.stringify({
            USER_LOGIN: config.login,
            USER_HASH: config.hash,
          }),
        )
        .then((response) => {
          if (response.status === 200 && response.data.response.auth) {
            this.cookies = response.headers['set-cookie'][0];

            return true;
          }

          throw new Error('unable-auth');
        });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getLeadById(id) {
    try {
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
        .then((response) => {
          if (response.status === 200 && response.data && response.data._embedded && response.data._embedded.items) {
            return response.data._embedded.items[0];
          }

          throw new Error('lead-not-found');
        });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getContactById(id) {
    try {
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
        .then((response) => {
          if (response.status === 200 && response.data && response.data._embedded && response.data._embedded.items) {
            return response.data._embedded.items[0];
          }

          throw new Error('contact-not-found');
        });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getContactPhoneByLeadId(id) {
    try {
      if (!this.isAuthorised()) await this.auth();

      const lead = await this.getLeadById(id);
      const contact = await this.getContactById(lead.main_contact.id);
      const { values } = contact.custom_fields[0];
      const phone = values.find((item) => item.enum === config.phoneEmunId);

      return `+${phone.value}`;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }


  async getCustomFields() {
    try {
      if (!this.isAuthorised()) await this.auth();

      const customFields = await axios
        .get('/api/v2/account?with=custom_fields', {
          headers: {
            cookie: this.cookies,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data._embedded) {
            return response.data._embedded.custom_fields;
          }

          throw new Error('Unable to get CustomFields');
        });

      this.customFields = customFields;

      return customFields;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getLead() {
    try {
      if (!this.isAuthorised()) await this.auth();
      if (!this.data.phone) throw new Error('No phone');

      const leads = await axios
        .get('/api/v2/leads', {
          headers: {
            cookie: this.cookies,
          },
          params: {
            query: this.data.phone,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data && response.data._embedded && response.data._embedded.items) {
            return response.data._embedded.items;
          }

          throw new Error('lead-not-found');
        });

      this.leads = leads;

      return leads;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async getContact(id) {
    try {
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
        .then((response) => {
          if (response.status === 200 && response.data && response.data._embedded && response.data._embedded.items) {
            return response.data._embedded.items[0];
          }

          throw new Error('Unable to get contact');
        });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async addContact() {
    try {
      if (!this.isAuthorised()) await this.auth();

      if (!this.customFields) throw new Error('No custom fields');

      const fieldsReference = {};

      Object.values(this.customFields.contacts).forEach((field) => {
        if (field.code === 'PHONE' || field.code === 'EMAIL') {
          fieldsReference[field.code] = {
            id: field.id,
          };
        }
      });

      const data = {
        add: [
          {
            name: `${this.firstName} ${this.secondName}`,
            tags: 'Из coursebot.automaton.bz',
            custom_fields: [
              {
                id: fieldsReference.PHONE.id,
                values: [
                  {
                    value: this.phone,
                    enum: 'MOB',
                  },
                ],
              },
              {
                id: fieldsReference.EMAIL.id,
                values: [
                  {
                    value: this.email,
                    enum: 'PRIV',
                  },
                ],
              },
            ],
          },
        ],
      };

      const contact = await axios
        .post('/api/v2/contacts', qs.stringify(data), {
          headers: {
            cookie: this.cookies,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data._embedded) {
            return response.data._embedded.items[0];
          }

          throw new Error('Unable to create Contact');
        });

      this.contact = contact;

      return contact;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async addLead() {
    try {
      if (!this.isAuthorised()) await this.auth();
      if (!this.contact) throw new Error('No contact');

      const data = {
        add: [
          {
            name: `${this.firstName} ${this.secondName}`,
            tags: 'Из coursebot.automaton.bz',
            pipeline_id: this.pipelineId,
            status_id: this.statusId,
            contacts_id: this.contact.id,
          },
        ],
      };

      const lead = await axios
        .post('/api/v2/leads', qs.stringify(data), {
          headers: {
            cookie: this.cookies,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data._embedded) {
            return response.data._embedded.items[0];
          }

          throw new Error('Unable to create Lead');
        });

      this.lead = lead;

      return lead;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async addNote() {
    try {
      if (!this.isAuthorised()) await this.auth();
      if (!this.lead) throw new Error('No lead');

      const data = {
        add: [
          {
            element_id: this.lead.id,
            element_type: 2,
            text: `Результат формы coursebot.automaton.bz:
Фамилия: ${this.firstName}
Имя: ${this.secondName}
Телефон: ${this.phone}
WhatsApp: ${this.whatsapp}
E-mail: ${this.email}
Город: ${this.city}
Комментарий: ${this.comment}`,
            note_type: 4,
          },
        ],
      };

      return axios
        .post('/api/v2/notes', qs.stringify(data), {
          headers: {
            cookie: this.cookies,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data._embedded) {
            return true;
          }

          throw new Error('Unable to create Lead');
        });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async updateLead(lead) {
    try {
      if (!this.isAuthorised()) await this.auth();

      let tags = [];

      if (lead.tags && Array.isArray(lead.tags)) {
        tags = lead.tags.map((tag) => tag.name).concat(this.leadTags);
      } else {
        tags = this.leadTags;
      }

      const data = {
        update: [
          {
            id: lead.id,
            tags: tags.toString(),
            status_id: this.statusId,
            updated_at: parseInt(Date.now() / 1000, 10),
          },
        ],
      };

      return axios
        .post('/api/v2/leads', qs.stringify(data), {
          headers: {
            cookie: this.cookies,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data._embedded.items.length) {
            return true;
          }

          throw new Error('Unable to update Lead');
        });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async updateContact(id, customFields) {
    try {
      if (!this.isAuthorised()) await this.auth();
      if (!id) throw new Error('No id');
      if (!customFields) throw new Error('No custom fields');

      const fieldsReference = {};

      Object.values(customFields.contacts).forEach((field) => {
        if (field.code === 'PHONE' || field.code === 'EMAIL') {
          fieldsReference[field.code] = {
            id: field.id,
          };
        }
      });

      const data = {
        update: [
          {
            id,
            updated_at: parseInt(Date.now() / 1000, 10),
            custom_fields: [
              {
                id: fieldsReference.EMAIL.id,
                values: [
                  {
                    value: this.data.email,
                    enum: 'PRIV',
                  },
                ],
              },
            ],
          },
        ],
      };

      return axios
        .post('/api/v2/contacts', qs.stringify(data), {
          headers: {
            cookie: this.cookies,
          },
        })
        .then((response) => {
          if (response.status === 200 && response.data._embedded.items.length) {
            return true;
          }

          throw new Error('Unable to update Contact');
        });
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  async sendToAmo(firstName, secondName, phone, whatsapp, email, city, comment) {
    try {
      if (!this.isAuthorised()) await this.auth();

      this.firstName = firstName;
      this.secondName = secondName;
      this.phone = phone;
      this.whatsapp = whatsapp;
      this.email = email;
      this.city = city;
      this.comment = comment;
      this.pipelineId = 3292687;
      this.statusId = 33190003;

      await this.getCustomFields();
      await this.addContact();
      await this.addLead();
      await this.addNote();

      return true;
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

  filterAlreadyClient(items) {
    return items.filter((item) => item.pipeline_id === this.alreadyClientsPipelineId
      && !item.is_deleted);
  }

  filterDuplicates(items) {
    return items.filter((item) => item.pipeline_id !== this.duplicatesPipelineId
      && !item.is_deleted);
  }

  async moveToStatus() {
    try {
      if (!this.isAuthorised()) await this.auth();

      const customFields = await this.getCustomFields();
      const leads = await this.getLead();

      const alreadyClient = this.filterAlreadyClient(leads);

      if (alreadyClient.length > 0) {
        const contact = await this.getContact(alreadyClient[0].main_contact.id);

        this.extra = {
          id: contact.id,
          name: contact.name,
        };

        throw new Error('lead-is-already-client');
      }

      const filtered = this.filterDuplicates(leads);
      const sorted = sortLeads(filtered);

      if (sorted.length === 0) {
        throw new Error('lead-not-found');
      }

      const lead = sorted[0];
      const isLeadInSearchedPipeline = this.searchPipelineIds.includes(lead.pipeline_id);

      if (!isLeadInSearchedPipeline) {
        throw new Error('lead-not-found');
      }

      const updateLeadResult = await this.updateLead(lead);
      const updateContactResult = await this.updateContact(lead.main_contact.id, customFields);

      if (!updateLeadResult && !updateContactResult) {
        throw new Error('unknown-error');
      }

      return updateLeadResult && updateContactResult;
    } catch (error) {
      console.error(error);

      return {
        code: 400,
        message: error.message,
        extra: this.extra,
      };
    }
  }
}
