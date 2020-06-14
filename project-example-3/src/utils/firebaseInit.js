import firebase from "firebase/app";
import "firebase/firestore";

const config = {};

const firestoreApp = firebase.initializeApp(config);

const firestore = firestoreApp.firestore();

export default firestore;
