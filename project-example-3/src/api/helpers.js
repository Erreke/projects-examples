import { tryJsonParse } from "@/utils/helpers";

function findNext(destinationQuestions, parsedRecord) {
  let nextId = null;
  const keys = Object.keys(destinationQuestions);

  for (let i = 0, len = keys.length; i < len; i++) {
    if (destinationQuestions[keys[i]].data.originId === parsedRecord) {
      nextId = keys[i];
      break;
    }
  }

  return nextId;
}

function getNext(destinationQuestions, record) {
  const parsedRecord = tryJsonParse(record);

  if (!parsedRecord) return null;

  if (typeof parsedRecord === "object") {
    const next = {};

    Object.keys(parsedRecord).forEach((key, index) => {
      next[index] = findNext(destinationQuestions, parsedRecord[key]);
    });

    return next;
  } else {
    return findNext(destinationQuestions, parsedRecord);
  }
}

export function duplicateQuiz(db, batch, sourceQuiz, destinationQuizId) {
  const destinationQuizRef = db.collection("quizes").doc(destinationQuizId);
  batch.set(destinationQuizRef, sourceQuiz);
}

export function duplicateQuestions(
  db,
  batch,
  sourceQuestions,
  destinationQuizId,
  createdBy
) {
  const destinationQuestions = {};

  Object.keys(sourceQuestions).forEach(key => {
    const destinationQuestionRef = db.collection("questions").doc();
    const destinationQuestionId = destinationQuestionRef.id;

    delete sourceQuestions[key].id;

    destinationQuestions[destinationQuestionId] = {
      ref: destinationQuestionRef,
      data: {
        ...sourceQuestions[key],
        originId: key,
        quizId: destinationQuizId,
        createdAt: new Date(),
        createdBy: createdBy,
        test: true
      }
    };
  });

  Object.keys(destinationQuestions).forEach(key => {
    const question = destinationQuestions[key];
    const questionData = Object.assign({}, question.data);
    const next = getNext(destinationQuestions, questionData.next);

    delete questionData.originId;

    batch.set(question.ref, {
      ...questionData,
      next: JSON.stringify(next)
    });
  });
}

export function duplicateResults(
  db,
  batch,
  sourceResults,
  destinationQuizId,
  createdBy
) {
  sourceResults.forEach(result => {
    const resultRef = db.collection("results").doc();

    delete result.id;

    batch.set(resultRef, {
      ...result,
      quizId: destinationQuizId,
      createdAt: new Date(),
      createdBy: createdBy,
      test: true
    });
  });
}
