import firebase from 'firebase/app';
import 'firebase/firestore';

const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export const firestoreApp = firebase.initializeApp(config);

export default firestoreApp.firestore();
