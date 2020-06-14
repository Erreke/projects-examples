import { tryJsonParse } from "@/utils/helpers";
import initialState from "./initial-state";

function generateAnswers(question) {
  const answers = {};

  Object.keys(question).forEach(item => {
    if (item.includes("answer")) {
      const index = item.substring(6);

      answers[index] = {
        id: index,
        value: question[item],
        weight: question[`weight${index}`] || 0
      };
    }
  });

  return answers;
}

function fixAnswers(currentQuestion) {
  if (typeof currentQuestion.selected === "object") {
    return {
      question: currentQuestion.title,
      answer:
        currentQuestion.selected.customValue || currentQuestion.selected.value,
      weight: currentQuestion.selected.weight
    };
  } else {
    return {
      question: currentQuestion.title,
      answer: currentQuestion.selected
    };
  }
}

export default {
  SET_SIGN_IN_PROCESS(state, payload) {
    state.isSignInProcess = payload;
  },

  SET_SIGN_IN_ERROR(state, payload) {
    state.signInError = payload;
  },

  CLEAR_SIGN_IN_ERROR(state) {
    state.signInError = null;
  },

  RESET_STATE(state) {
    Object.assign(state, initialState);
  },

  SET_USER(state, payload) {
    state.user = payload;
  },

  UNSET_USER(state) {
    state.user = null;
  },

  SET_QUIZ(state, payload) {
    state.quiz = payload;
  },

  SET_QUIZES(state, payload) {
    state.quizes = payload;
  },

  SET_QUESTIONS(state, payload) {
    const questions = {};

    for (let i = 0, len = payload.length; i < len; i++) {
      if (payload[i].type === "radio") {
        questions[payload[i].id] = {
          id: payload[i].id,
          type: payload[i].type,
          title: payload[i].title,
          answers: generateAnswers(payload[i]),
          selected: {
            id: null,
            value: null,
            weight: null,
            customValue: null
          },
          next: tryJsonParse(payload[i].next),
          isVertext: payload[i].isVertext
        };
      }

      if (payload[i].type === "slider" || payload[i].type === "range") {
        questions[payload[i].id] = {
          id: payload[i].id,
          type: payload[i].type,
          title: payload[i].title,
          min: payload[i].min,
          max: payload[i].max,
          step: payload[i].step,
          selected: null,
          next: tryJsonParse(payload[i].next),
          isVertext: payload[i].isVertext
        };
      }
    }

    state.questions = questions;
  },

  SET_RESULTS(state, payload) {
    state.results = payload;
  },

  SET_RESULT_TITLE(state, payload) {
    state.resultTitle = payload;
  },

  SET_RESULT_TEXT(state, payload) {
    state.resultText = payload;
  },

  SET_RESULT_WEIGHT(state, payload) {
    state.resultWeight = payload;
  },

  START_QUIZ(state) {
    const keys = Object.keys(state.questions);

    for (let i = 0, len = keys.length; i < len; i += 1) {
      if (state.questions[keys[i]].isVertext) {
        state.currentQuestionId = state.questions[keys[i]].id;
        state.isQuizStarted = true;
        break;
      }
    }

    state.step += 1;
  },

  SELECT_ANSWER(state, payload) {
    if (payload.type === "radio") {
      const value = state.questions[payload.qid].answers[payload.aid].value;
      const weight = state.questions[payload.qid].answers[payload.aid].weight;

      state.questions[payload.qid].selected.id = payload.aid;
      state.questions[payload.qid].selected.value = value;
      state.questions[payload.qid].selected.weight = weight;
      state.questions[payload.qid].selected.customValue = payload.customValue;
    }

    if (payload.type === "slider") {
      state.questions[payload.qid].selected = payload.value;
    }
  },

  GOTO_NEXT_QUESTION(state) {
    const currentQuestion = state.questions[state.currentQuestionId];

    if (currentQuestion.next) {
      let nextQuestionId;

      if (typeof currentQuestion.next === "object") {
        nextQuestionId = currentQuestion.next[currentQuestion.selected.id];
      } else {
        nextQuestionId = currentQuestion.next;
      }

      state.questions[nextQuestionId] = Object.assign(
        {},
        state.questions[nextQuestionId],
        {
          prev: currentQuestion.id
        }
      );

      state.currentQuestionId = nextQuestionId;
    } else {
      state.isQuizEnded = true;
    }

    state.answers[currentQuestion.id] = fixAnswers(currentQuestion);

    state.step += 1;
  },

  GOTO_PREV_QUESTION(state) {
    const currentQuestion = state.questions[state.currentQuestionId];

    delete state.answers[currentQuestion.id];

    state.currentQuestionId = currentQuestion.prev;

    state.step -= 1;
  },

  SET_RESULT_COUNTER_SHOWN_STATUS(state, payload) {
    state.isResultCounterBeenShown = payload;
  },

  OPEN_DIALOG(state) {
    state.isPrivacyPolicyDialogActive = true;
  },

  CLOSE_DIALOG(state) {
    state.isPrivacyPolicyDialogActive = false;
  },

  SET_ANSWERS_SENDED_STATUS(state, payload) {
    state.isAnswersSendedToAmoCRM = payload;
  },

  OPEN_DUPLICATING_DIALOG(state) {
    state.isDuplicatingDialogOpened = true;
  },

  CLOSE_DUPLICATING_DIALOG(state) {
    state.isDuplicatingDialogOpened = false;
  },

  START_DUPLICATING(state) {
    state.isQuizDuplicating = true;
  },

  STOP_DUPLICATING(state) {
    state.isQuizDuplicating = false;
  },

  SET_DUPLICATING_ERROR(state, payload) {
    state.duplicatingError = payload;
  },

  OPEN_DELETING_DIALOG(state) {
    state.isDeletingDialogOpened = true;
  },

  CLOSE_DELETING_DIALOG(state) {
    state.isDeletingDialogOpened = false;
  },

  START_DELETING(state) {
    state.isQuizDeleting = true;
  },

  STOP_DELETING(state) {
    state.isQuizDeleting = false;
  },

  SET_DELETING_ERROR(state, payload) {
    state.deletingError = payload;
  },

  SET_QUIZ_LOADING_STATUS(state, payload) {
    state.isQuizesLoading = payload;
  }
};
