export default function(state) {
  // return "AUTHORIZING_FIRST_STEP";
  // return "AUTHORIZING_SECOND_STEP";

  if (
    !state.user &&
    !state.isSignInBySMSFirstStepCompleted &&
    !state.isSignInBySMSSecondStepCompleted &&
    !state.isSignInByEmailFirstStepCompleted &&
    !state.isSignInByEmailSecondStepCompleted &&
    !state.stream &&
    !state.isStreamNotFound
  ) {
    return "STREAM_LOADING";
  }

  if (
    !state.user &&
    !state.isSignInBySMSFirstStepCompleted &&
    !state.isSignInBySMSSecondStepCompleted &&
    !state.isSignInByEmailFirstStepCompleted &&
    !state.isSignInByEmailSecondStepCompleted &&
    !state.stream &&
    state.isStreamNotFound
  ) {
    return "STREAM_NOT_FOUND";
  }

  if (
    !state.user &&
    !state.isSignInBySMSFirstStepCompleted &&
    !state.isSignInBySMSSecondStepCompleted &&
    !state.isSignInByEmailFirstStepCompleted &&
    !state.isSignInByEmailSecondStepCompleted &&
    state.stream &&
    !state.isStreamNotFound
  ) {
    return "SMS_AUTHORIZING_FIRST_STEP";
  }

  if (
    !state.user &&
    state.isSignInBySMSFirstStepCompleted &&
    !state.isSignInBySMSSecondStepCompleted &&
    !state.isSignInByEmailFirstStepCompleted &&
    !state.isSignInByEmailSecondStepCompleted &&
    state.stream &&
    !state.isStreamNotFound
  ) {
    return "SMS_AUTHORIZING_SECOND_STEP";
  }

  if (
    !state.user &&
    state.isSignInBySMSFirstStepCompleted &&
    state.isSignInBySMSSecondStepCompleted &&
    !state.isSignInByEmailFirstStepCompleted &&
    !state.isSignInByEmailSecondStepCompleted &&
    state.stream &&
    !state.isStreamNotFound
  ) {
    return "EMAIL_AUTHORIZING_FIRST_STEP";
  }

  if (
    !state.user &&
    state.isSignInBySMSFirstStepCompleted &&
    state.isSignInBySMSSecondStepCompleted &&
    state.isSignInByEmailFirstStepCompleted &&
    !state.isSignInByEmailSecondStepCompleted &&
    state.stream &&
    !state.isStreamNotFound
  ) {
    return "EMAIL_AUTHORIZING_SECOND_STEP";
  }

  if (state.user && state.stream && !state.isStreamNotFound) {
    return "STREAMING";
  }

  return "UNKNOWN_MODE";
}
