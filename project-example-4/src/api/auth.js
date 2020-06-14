import firebase from "firebase/app";
import "firebase/auth";

export function initRecaptchaVerifier({ buttonId, callback }) {
  firebase.auth().useDeviceLanguage();

  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(buttonId, {
    size: "invisible",
    callback: callback
  });
}

function sendSMSToPhoneNumber(phone) {
  console.log("sendSMSToPhoneNumber:", phone);

  return firebase.auth().signInWithPhoneNumber(phone, window.recaptchaVerifier);
}

function signInWithEmailAndPassword(email, password) {
  return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => firebase.auth().signInWithEmailAndPassword(email, password));
}

function sendSignInLinkToEmail(email, url) {
  var actionCodeSettings = {
    url: url,
    handleCodeInApp: true
  };

  return firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings);
}

function signInWithEmailLink(email, href) {
  if (firebase.auth().isSignInWithEmailLink(href)) {
    return firebase.auth().signInWithEmailLink(email, href);
  }

  return Promise.reject();
}

function signOut() {
  return firebase.auth().signOut();
}

export default {
  initRecaptchaVerifier,
  sendSMSToPhoneNumber,
  signInWithEmailAndPassword,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signOut
};
