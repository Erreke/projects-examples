import db from "@/utils/firebaseInit";
import { duplicateQuiz, duplicateQuestions, duplicateResults } from "./helpers";

function fetchQuiz(quizId) {
  return db
    .collection("quizes")
    .doc(quizId)
    .get()
    .then(quiz => {
      if (quiz.exists) {
        return {
          id: quiz.id,
          ...quiz.data()
        };
      }

      return null;
    });
}

function fetchQuizes(userId) {
  return db
    .collection("quizes")
    .where("owner", "==", userId)
    .get()
    .then(snapshot => {
      const results = [];

      snapshot.forEach(quiz => {
        results.push({
          id: quiz.id,
          ...quiz.data()
        });
      });

      return results;
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error("Error getting quizes", err);
    });
}

function fetchQuestions(quizId) {
  return db
    .collection("questions")
    .where("quizId", "==", quizId)
    .get()
    .then(snapshot => {
      const results = [];

      snapshot.forEach(question => {
        results.push({
          id: question.id,
          ...question.data()
        });
      });

      return results;
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error("Error getting questions", err);
    });
}

function fetchResults(quizId) {
  return db
    .collection("results")
    .where("quizId", "==", quizId)
    .get()
    .then(snapshot => {
      const results = [];

      snapshot.forEach(result => {
        results.push({
          id: result.id,
          ...result.data()
        });
      });

      return results;
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error("Error getting results", err);
    });
}

function fetchUserData(uid) {
  return db
    .collection("users")
    .doc(uid)
    .get()
    .then(doc => {
      if (doc.exists) {
        return doc.data();
      }
      return {};
    });
}

function sendAnswers(answers) {
  return db
    .collection("answers")
    .doc()
    .set(answers);
}

function duplicateAll(sourceQuiz, sourceQuestions, sourceResults) {
  const destinationQuizId = sourceQuiz.destinationId;
  const createdBy = sourceQuiz.createdBy;

  delete sourceQuiz.id;
  delete sourceQuiz.sourceId;
  delete sourceQuiz.destinationId;

  const batch = db.batch();

  duplicateQuiz(db, batch, sourceQuiz, destinationQuizId);
  duplicateQuestions(db, batch, sourceQuestions, destinationQuizId, createdBy);
  duplicateResults(db, batch, sourceResults, destinationQuizId, createdBy);

  return batch.commit().then(result => result);
}

function deleteQuiz(quiz, questions, results) {
  const batch = db.batch();

  const quizeRef = db.collection("quizes").doc(quiz.id);
  batch.delete(quizeRef);

  Object.keys(questions).forEach(key => {
    const questionRef = db.collection("questions").doc(questions[key].id);
    batch.delete(questionRef);
  });

  results.forEach(result => {
    const resultRef = db.collection("results").doc(result.id);
    batch.delete(resultRef);
  });

  return batch.commit().then(result => result);
}

export default {
  fetchQuiz,
  fetchQuizes,
  fetchQuestions,
  fetchResults,
  fetchUserData,
  sendAnswers,
  duplicateAll,
  deleteQuiz
};
