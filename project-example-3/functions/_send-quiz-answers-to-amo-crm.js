const AmoCrm = require("./amocrm");

function updateSendedStatus(db, answerId) {
  return db
    .collection("answers")
    .doc(answerId)
    .update({ sended: true })
    .catch(e => {
      console.error(e);
      throw new Error("Unable update Answers table");
    });
}

module.exports = function(db, snapshot, context) {
  const { name, email, phone, answers, amoPipelineId } = snapshot.data();
  const answerId = context.params.answerId;

  const config = {
    project: "",
    login: "",
    hash: "",
    user: {
      name,
      email,
      phone
    },
    note: answers.replace(/\|/g, "\n"),
    newContactTags: "Квиз, Instagram",
    newLeadName: "Ответы на квиз",
    newLeadTags: "Квиз, Instime",
    pipelineId: amoPipelineId
  };

  const amo = new AmoCrm(config);

  return amo
    .send()
    .then(response => {
      if (response) {
        return updateSendedStatus(db, answerId);
      }

      return null;
    })
    .catch(error => console.log(error));
};
