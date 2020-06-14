const qs = require("qs");
const axios = require("axios");

class AmoCrm {
  constructor({
    project,
    userLogin,
    userHash,
    data,
    city,
    note,
    contactTags,
    newLeadName,
    leadTags,
    pipelineIds,
    statusIds,
    searchPipelineIds,
    alreadyClientsPipelineId,
    duplicatesPipelineId,
  }) {
    this.userLogin = userLogin;
    this.userHash = userHash;
    this.data = data;
    this.city = city;
    this.note = note;
    this.contactTags = contactTags;
    this.newLeadName = newLeadName;
    this.leadTags = leadTags;
    this.pipelineId = pipelineIds[city];
    this.statusId = statusIds[city];
    this.searchPipelineIds = searchPipelineIds;
    this.alreadyClientsPipelineId = alreadyClientsPipelineId;
    this.duplicatesPipelineId = duplicatesPipelineId;
    this.cookies = null;
    this.isAuth = null;
    this.customFields = null;
    this.leads = null;
    this.extra = null;

    axios.defaults.baseURL = `https://${project}.amocrm.ru`;
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
  }

  async auth() {
    const isAuth = await axios
      .post(
        "/private/api/auth.php?type=json",
        qs.stringify({
          USER_LOGIN: this.userLogin,
          USER_HASH: this.userHash
        })
      )
      .then(response => {
        if (response.status === 200 && response.data.response.auth) {
          this.cookies = response.headers["set-cookie"][0];

          return true;
        }

        throw new Error("Unable to auth");
      });

    this.isAuth = isAuth;

    return isAuth;
  }

  async getCustomFields() {
    if (!this.isAuth) throw new Error("Not authorized");

    const customFields = await axios
      .get("/api/v2/account?with=custom_fields", {
        headers: {
          cookie: this.cookies
        }
      })
      .then(response => {
        if (response.status === 200 && response.data._embedded) {
          return response.data._embedded.custom_fields;
        }

        throw new Error("Unable to get CustomFields");
      });

    this.customFields = customFields;

    return customFields;
  }

  async getLead() {
    if (!this.data.phone) throw new Error("No phone");

    const leads = await axios
      .get('/api/v2/leads', {
        headers: {
          cookie: this.cookies,
        },
        params: {
          query: this.data.phone,
        },
      })
      .then(response => {
        if (response.status === 200 && response.data && response.data._embedded && response.data._embedded.items) {
          return response.data._embedded.items;
        }

        throw new Error('lead-not-found');
      });

    this.leads = leads;

    return leads;
  }

  async getContact(id) {
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

        throw new Error("Unable to get contact");
      });
  }

  addContact() {
    if (!this.customFields) throw new Error("No custom fields");

    const fieldsReference = {};

    Object.values(this.customFields.contacts).forEach(field => {
      if (field.code === "PHONE" || field.code === "EMAIL") {
        fieldsReference[field.code] = {
          id: field.id
        };
      }
    });

    const data = {
      add: [
        {
          name: this.data.name,
          tags: this.contactTags.toString(),
          custom_fields: [
            {
              id: fieldsReference["PHONE"].id,
              values: [
                {
                  value: this.data.phone,
                  enum: "MOB"
                }
              ]
            },
            {
              id: fieldsReference["EMAIL"].id,
              values: [
                {
                  value: this.data.email,
                  enum: "PRIV"
                }
              ]
            }
          ]
        }
      ]
    };

    return axios
      .post("/api/v2/contacts", qs.stringify(data), {
        headers: {
          cookie: this.cookies
        }
      })
      .then(response => {
        if (response.status === 200 && response.data._embedded) {
          return response.data._embedded.items[0];
        }

        throw new Error("Unable to create Contact");
      });
  }

  async updateContact(id, customFields) {
    if (!id) throw new Error("No id");
    if (!customFields) throw new Error("No custom fields");

    const fieldsReference = {};

    Object.values(customFields.contacts).forEach(field => {
      if (field.code === "PHONE" || field.code === "EMAIL") {
        fieldsReference[field.code] = {
          id: field.id
        };
      }
    });

    const data = {
      update: [
        {
          id: id,
          updated_at: parseInt(Date.now() / 1000, 10),
          custom_fields: [
            {
              id: fieldsReference["EMAIL"].id,
              values: [
                {
                  value: this.data.email,
                  enum: "PRIV"
                }
              ]
            }
          ]
        }
      ]
    };

    return axios
      .post("/api/v2/contacts", qs.stringify(data), {
        headers: {
          cookie: this.cookies
        }
      })
      .then(response => {
        if (response.status === 200 && response.data._embedded.items.length) {
          return true;
        }

        throw new Error("Unable to update Contact");
      });
  }

  addLead(contact) {
    const data = {
      add: [
        {
          name: this.newLeadName,
          tags: this.leadTags.toString(),
          pipeline_id: this.pipelineId,
          status_id: this.statusId,
          contacts_id: contact.id
        }
      ]
    };

    return axios
      .post("/api/v2/leads", qs.stringify(data), {
        headers: {
          cookie: this.cookies
        }
      })
      .then(response => {
        if (response.status === 200 && response.data._embedded) {
          return response.data._embedded.items[0];
        }

        throw new Error("Unable to create Lead");
      });
  }

  addNote(lead) {
    const data = {
      add: [
        {
          element_id: lead.id,
          element_type: 2,
          text: this.note,
          note_type: 4
        }
      ]
    };

    return axios
      .post("/api/v2/notes", qs.stringify(data), {
        headers: {
          cookie: this.cookies
        }
      })
      .then(response => {
        if (response.status === 200 && response.data._embedded) {
          return true;
        }

        throw new Error("Unable to create Lead");
      });
  }

  async updateLead(lead) {
    let tags = [];

    if (lead.tags && Array.isArray(lead.tags)) {
      tags = lead.tags.map(tag => tag.name).concat(this.leadTags);
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
        }
      ]
    };

    return axios
      .post("/api/v2/leads", qs.stringify(data), {
        headers: {
          cookie: this.cookies
        }
      })
      .then(response => {
        if (response.status === 200 && response.data._embedded.items.length) {
          return true
        }

        throw new Error("Unable to update Lead");
      });
  }

  send() {
    return this.auth()
      .then(isAuth => this.getCustomFields(isAuth))
      .then(fields => this.addContact(fields))
      .then(contact => this.addLead(contact))
      .then(lead => this.addNote(lead))
      .catch(error => {
        console.error(error);
      });
  }

  filterAlreadyClient(items) {
    return items.filter((item) => {
      return item.pipeline_id === this.alreadyClientsPipelineId && !item.is_deleted;
    });
  }

  filterDuplicates(items) {
    return items.filter((item) => {
      return item.pipeline_id !== this.duplicatesPipelineId && !item.is_deleted;
    });
  }

  sortLeads(items) {
    return items.sort((a, b) => {
      return b.created_at - a.created_at;
    });
  }

  async moveToStatus() {
    try {
      await this.auth();
      const customFields = await this.getCustomFields();
      const leads = await this.getLead();

      const alreadyClient = this.filterAlreadyClient(leads);

      if (alreadyClient.length > 0) {
        const contact = await this.getContact(alreadyClient[0].main_contact.id);

        this.extra = {
          id: contact.id,
          name: contact.name,
        }

        throw new Error('lead-is-already-client');
      }

      const filtered = this.filterDuplicates(leads);
      const sorted = this.sortLeads(filtered);

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
    }
    catch (error) {
      console.error(error);

      return {
        code: 400,
        message: error.message,
        extra: this.extra,
      };
    }
  }
}

module.exports = AmoCrm;
