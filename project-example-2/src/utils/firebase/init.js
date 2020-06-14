import firebase from "firebase/app";
import "firebase/firestore";

const config = {};

export const firestoreApp = firebase.initializeApp(config);

firebase
  .firestore()
  .enablePersistence()
  .catch(error => {
    console.error(error);

    if (error.code === "unimplemented") {
      console.warn(
        "The current browser does not support all of the features required to enable persistence"
      );
    }
  });

export default firestoreApp.firestore();
