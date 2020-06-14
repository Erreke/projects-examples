export default function(state) {
  if (
    state.quiz &&
    !state.isQuizStarted &&
    !state.isQuizEnded &&
    !state.isResultCounterBeenShown &&
    !state.isAnswersSendedToAmoCRM
  ) {
    return "STARTER_MODE";
  }

  if (
    state.quiz &&
    state.isQuizStarted &&
    !state.isQuizEnded &&
    !state.isResultCounterBeenShown &&
    !state.isAnswersSendedToAmoCRM
  ) {
    return "PROCESSOR_MODE";
  }

  if (
    state.quiz &&
    state.isQuizStarted &&
    state.isQuizEnded &&
    !state.isResultCounterBeenShown &&
    !state.isAnswersSendedToAmoCRM
  ) {
    return "COUNTER_MODE";
  }

  if (
    state.quiz &&
    state.isQuizStarted &&
    state.isQuizEnded &&
    state.isResultCounterBeenShown &&
    !state.isAnswersSendedToAmoCRM
  ) {
    return "FORM_MODE";
  }

  if (
    state.quiz &&
    state.isQuizStarted &&
    state.isQuizEnded &&
    state.isResultCounterBeenShown &&
    state.isAnswersSendedToAmoCRM
  ) {
    return "RESULTS_MODE";
  }

  return "UNKNOWN_MODE";
}
