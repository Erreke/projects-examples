import firebase from "firebase/app";
import "firebase/auth";
import axios from "axios";
import { HOST } from "@/config";

function signIn(email, password) {
  return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(() => firebase.auth().signInWithEmailAndPassword(email, password));
}

function signOut() {
  return firebase.auth().signOut();
}

function signInByProvider(provider) {
  const authProvider = new firebase.auth[`${provider}AuthProvider`]();

  return firebase.auth().signInWithPopup(authProvider);
}

function sendPasswordResetEmail(email) {
  return firebase.auth().sendPasswordResetEmail(email);
}

function applyActionCode(actionCode) {
  return firebase.auth().applyActionCode(actionCode);
}

function checkActionCode(actionCode) {
  return firebase.auth().checkActionCode(actionCode);
}

function getEmailVerificationInfo() {
  const user = firebase.auth().currentUser;

  if (user) {
    return user.reload().then(() => firebase.auth().currentUser.emailVerified);
  }

  return Promise.resolve(false);
}

function verifyPasswordResetCode(actionCode) {
  return firebase.auth().verifyPasswordResetCode(actionCode);
}

function confirmPasswordReset(actionCode, password) {
  return firebase.auth().confirmPasswordReset(actionCode, password);
}

function reauthenticate(currentPassword) {
  const user = firebase.auth().currentUser;
  const credentials = firebase.auth.EmailAuthProvider.credential(
    user.email,
    currentPassword
  );

  return user.reauthenticateWithCredential(credentials);
}

function changeUserPassword(currentPassword, password) {
  const user = firebase.auth().currentUser;

  return reauthenticate(currentPassword).then(() =>
    user.updatePassword(password)
  );
}

function changeUserEmail(currentPassword, email) {
  const user = firebase.auth().currentUser;

  return reauthenticate(currentPassword).then(() => user.updateEmail(email));
}

function sendSMSForPhoneNumberVerification(phoneNumber, recaptchaContainerId) {
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
    recaptchaContainerId,
    {
      size: "invisible"
    }
  );

  const provider = new firebase.auth.PhoneAuthProvider();

  return provider.verifyPhoneNumber(phoneNumber, window.recaptchaVerifier);
}

function getPhoneCredential(verificationId, smsCode) {
  return firebase.auth.PhoneAuthProvider.credential(verificationId, smsCode);
}

function changeUserPhone(currentPassword, phoneCredential) {
  const user = firebase.auth().currentUser;

  return reauthenticate(currentPassword).then(() =>
    user.updatePhoneNumber(phoneCredential)
  );
}

function getCurrentUserIdToken() {
  return firebase
    .auth()
    .currentUser.getIdToken(true)
    .then(token => token);
}

function recoverEmailInProfile(email) {
  return axios.post(`${HOST}/api/v1/recover-email-in-profile/`, { email });
}

export default {
  signIn,
  signOut,
  signInByProvider,
  sendPasswordResetEmail,
  applyActionCode,
  checkActionCode,
  getEmailVerificationInfo,
  verifyPasswordResetCode,
  confirmPasswordReset,
  changeUserPassword,
  changeUserEmail,
  sendSMSForPhoneNumberVerification,
  getPhoneCredential,
  changeUserPhone,
  getCurrentUserIdToken,
  recoverEmailInProfile
};
