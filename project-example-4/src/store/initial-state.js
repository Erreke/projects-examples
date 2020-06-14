export default {
  user: null,

  signInBySMSFirstStepError: null,
  signInBySMSSecondStepError: null,
  isSignInBySMSFirstStepProcessing: false,
  isSignInBySMSSecondStepProcessing: false,
  isSignInBySMSFirstStepCompleted: false,
  isSignInBySMSSecondStepCompleted: false,

  signInByEmailFirstStepError: null,
  signInByEmailSecondStepError: null,
  isSignInByEmailFirstStepProcessing: false,
  isSignInByEmailSecondStepProcessing: false,
  isSignInByEmailFirstStepCompleted: false,
  isSignInByEmailSecondStepCompleted: false,

  isSignOutProcessing: false,

  stream: null,
  isStreamNotFound: false,
  isMessageSendProcessing: false,
  sendMessageError: null,
  comments: {},
  members: {},
  isUnsubscribedFromFirestore: false
};
