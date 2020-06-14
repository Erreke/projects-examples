export default {
  user: null,
  quiz: null,
  quizes: [],
  questions: {},
  currentQuestionId: null,
  answers: {},
  results: [],
  resultTitle: "",
  resultText: "",
  resultWeight: 0,
  step: 0,

  isQuizStarted: false,
  isQuizEnded: false,
  isResultCounterBeenShown: false,
  isAnswersSendedToAmoCRM: false,

  signInError: null,
  duplicatingError: null,

  isSignInProcess: false,
  isQuizesLoading: false,
  isPrivacyPolicyDialogActive: false,

  isDuplicatingDialogOpened: false,
  isQuizDuplicating: false,

  isDeletingDialogOpened: false,
  isQuizDeleting: false,
  deletingError: null
};
