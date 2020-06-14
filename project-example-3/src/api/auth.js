import firebase from "firebase/app";
import "firebase/auth";

function signIn(email, password) {
  return firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION)
    .then(() => firebase.auth().signInWithEmailAndPassword(email, password));
}

function signOut() {
  return firebase.auth().signOut();
}

export default {
  signIn,
  signOut
};
