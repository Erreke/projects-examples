import authAPI from "@/api/auth";
import dbAPI from "@/api/db";

function composeUserProfile(user, userData) {
  return {
    // data from Firebase.Auth
    uid: user.uid,
    email: user.email,
    emailVerified: user.emailVerified,

    // data from Firestore 'users' table
    isAdmin: userData.isAdmin
  };
}

function composeUserAnswers(answers, quizId) {
  const result = Object.keys(answers).map(key => {
    const q = answers[key].question;
    const a = answers[key].answer;

    return [q, a].join("|");
  });

  result.push(`Страница: https://quiz.automaton.bz/${quizId}`);

  return result.join("||");
}

function getQuiz(state, payload) {
  const quizIndex = state.quizes.findIndex(
    quiz => quiz.id === payload.sourceId
  );
  const quiz = Object.assign({}, state.quizes[quizIndex]);

  return { ...quiz, ...payload };
}

async function getQuestions(quizId) {
  return await dbAPI.fetchQuestions(quizId).then(rawQuestions => {
    const questions = {};

    for (let i = 0, len = rawQuestions.length; i < len; i++) {
      questions[rawQuestions[i].id] = rawQuestions[i];
    }

    return questions;
  });
}

async function getResults(quizId) {
  return await dbAPI.fetchResults(quizId).then(results => results);
}

export default {
  INIT_USER({ commit }, user) {
    return dbAPI.fetchUserData(user.uid).then(userData => {
      const userProfile = composeUserProfile(user, userData);

      commit("SET_USER", userProfile);

      return userProfile;
    });
  },

  SIGN_IN_REQUEST: ({ commit }, { email, password }) => {
    commit("CLEAR_SIGN_IN_ERROR");
    commit("SET_SIGN_IN_PROCESS", true);

    return authAPI.signIn(email, password).then(
      response => {
        commit("SET_SIGN_IN_PROCESS", false);

        return response.user;
      },
      error => {
        commit("UNSET_USER");
        commit("SET_SIGN_IN_PROCESS", false);

        throw new Error(error.code);
      }
    );
  },

  SIGN_OUT_REQUEST: ({ commit }) => {
    return authAPI.signOut().then(() => commit("RESET_STATE"));
  },

  FETCH_QUIZ: ({ commit }, quizId) => {
    return dbAPI.fetchQuiz(quizId).then(quiz => {
      commit("SET_QUIZ", quiz);

      return quiz;
    });
  },

  FETCH_QUIZES: ({ commit }, userId) => {
    commit("SET_QUIZ_LOADING_STATUS", true);
    return dbAPI.fetchQuizes(userId).then(quizes => {
      commit("SET_QUIZES", quizes);
      commit("SET_QUIZ_LOADING_STATUS", false);

      return quizes;
    });
  },

  FETCH_QUESTIONS: ({ commit }, quizId) => {
    return dbAPI.fetchQuestions(quizId).then(questions => {
      commit("SET_QUESTIONS", questions);

      return questions;
    });
  },

  FETCH_RESULTS: ({ commit }, quizId) => {
    return dbAPI.fetchResults(quizId).then(results => {
      commit("SET_RESULTS", results);

      return results;
    });
  },

  SEND_ANSWERS: ({ state, commit }, payload) => {
    const answers = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      answers: composeUserAnswers(state.answers, payload.quizId),
      quizId: payload.quizId,
      amoPipelineId: payload.amoPipelineId,
      sended: false,
      createdAt: new Date()
    };

    return dbAPI
      .sendAnswers(answers)
      .then(() => commit("SET_ANSWERS_SENDED_STATUS", true));
  },

  DUPLICATE_QUIZ: async ({ state, commit, dispatch }, payload) => {
    commit("SET_DUPLICATING_ERROR", null);
    commit("START_DUPLICATING");

    const sourceQuiz = getQuiz(state, payload);
    const sourceQuestions = await getQuestions(payload.sourceId);
    const sourceResults = await getResults(payload.sourceId);

    return dbAPI
      .duplicateAll(sourceQuiz, sourceQuestions, sourceResults)
      .then(() => {
        commit("STOP_DUPLICATING");
        commit("CLOSE_DUPLICATING_DIALOG");
        dispatch("FETCH_QUIZES", state.user.uid);
      })
      .catch(error => {
        commit("STOP_DUPLICATING");
        commit("SET_DUPLICATING_ERROR", error);
      });
  },

  DELETE_QUIZ: async ({ state, commit, dispatch }, payload) => {
    commit("SET_DELETING_ERROR", null);
    commit("START_DELETING");

    const quiz = getQuiz(state, payload);
    const questions = await getQuestions(payload.sourceId);
    const results = await getResults(payload.sourceId);

    return dbAPI
      .deleteQuiz(quiz, questions, results)
      .then(() => {
        commit("STOP_DELETING");
        commit("CLOSE_DELETING_DIALOG");
        dispatch("FETCH_QUIZES", state.user.uid);
      })
      .catch(error => {
        commit("STOP_DELETING");
        commit("SET_DELETING_ERROR", error);
      });
  }
};
