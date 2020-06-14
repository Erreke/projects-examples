import firebase from 'firebase/app';
import 'firebase/firestore';

let firestoreApp;

if (!firebase.apps.length) {

  const config = {
    apiKey: '',
    authDomain: '',
    databaseURL: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: '',
  };

  firestoreApp = firebase.initializeApp(config);

  firebase.firestore().enablePersistence()
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);

      if (error.code === 'unimplemented') {
        // eslint-disable-next-line no-console
        console.warn('The current browser does not support all of the features required to enable persistence');
      }
    });
}

// export firestoreApp;
export default firestoreApp.firestore();