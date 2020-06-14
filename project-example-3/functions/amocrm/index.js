const qs = require("qs");
const axios = require("axios");

class AmoCrm {
  constructor({
    project,
    login,
    hash,
    user,
    note,
    newContactTags,
    newLeadName,
    newLeadTags,
    pipelineId
  }) {
    this.login = login;
    this.hash = hash;
    this.user = user;
    this.note = note;
    this.newContactTags = newContactTags;
    this.newLeadName = newLeadName;
    this.newLeadTags = newLeadTags;
    this.pipelineId = pipelineId;
    this.cookies = null;

    axios.defaults.baseURL = `https://${project}.amocrm.ru`;
    axios.defaults.headers.post["Content-Type"] =
      "application/x-www-form-urlencoded";
  }

  auth() {
    return axios
      .post(
        "/private/api/auth.php?type=json",
        qs.stringify({
          USER_LOGIN: this.login,
          USER_HASH: this.hash
        })
      )
      .then(response => {
        if (response.status === 200 && response.data.response.auth) {
          this.cookies = response.headers["set-cookie"][0];

          return true;
        }

        throw new Error("Unable to auth");
      })
      .catch(error => {
        console.log(error);
      });
  }

  getCustomFields(isAuth) {
    if (!isAuth) return false;

    return axios
      .get("/api/v2/account?with=custom_fields", {
        headers: {
          cookie: this.cookies
        }
      })
      .then(response => {
        if (response.status === 200 && response.data._embedded) {
          console.log("==============================");
          console.log(
            "getCustomFields response.data._embedded:",
            response.data._embedded
          );
          console.log("==============================");

          return response.data._embedded.custom_fields;
        }

        throw new Error("Unable to get CustomFields");
      })
      .catch(error => {
        console.log(error);
      });
  }

  addContact(fields) {
    console.log("==============================");
    console.log("addContact fields:", fields);
    console.log("==============================");

    const fieldsReference = {};

    Object.values(fields.contacts).forEach(field => {
      if (field.code === "PHONE" || field.code === "EMAIL") {
        fieldsReference[field.code] = {
          id: field.id
        };
      }
    });

    const data = {
      add: [
        {
          name: this.user.name,
          tags: this.newContactTags,
          custom_fields: [
            {
              id: fieldsReference["PHONE"].id,
              values: [
                {
                  value: this.user.phone,
                  enum: "MOB"
                }
              ]
            },
            {
              id: fieldsReference["EMAIL"].id,
              values: [
                {
                  value: this.user.email,
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
          console.log("==============================");
          console.log(
            "addContact response.data._embedded:",
            response.data._embedded
          );
          console.log("==============================");

          return response.data._embedded.items[0];
        }

        throw new Error("Unable to create Contact");
      })
      .catch(error => {
        console.log(error);
      });
  }

  addLead(contact) {
    console.log("==============================");
    console.log("addLead contact:", contact);
    console.log("==============================");

    const data = {
      add: [
        {
          name: this.newLeadName,
          tags: this.newLeadTags,
          pipeline_id: this.pipelineId,
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
          console.log("==============================");
          console.log(
            "addLead response.data._embedded:",
            response.data._embedded
          );
          console.log("==============================");

          return response.data._embedded.items[0];
        }

        throw new Error("Unable to create Lead");
      })
      .catch(error => {
        console.log(error);
      });
  }

  addNote(lead) {
    console.log("==============================");
    console.log("addNote lead:", lead);
    console.log("==============================");

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
          console.log("==============================");
          console.log(
            "addNote response.data._embedded:",
            response.data._embedded
          );
          console.log("==============================");

          return true;
        }

        throw new Error("Unable to create Lead");
      })
      .catch(error => {
        console.log(error);
      });
  }

  send() {
    return this.auth()
      .then(isAuth => this.getCustomFields(isAuth))
      .then(fields => this.addContact(fields))
      .then(contact => this.addLead(contact))
      .then(lead => this.addNote(lead))
      .catch(error => {
        console.log(error);
      });
  }
}

module.exports = AmoCrm;
