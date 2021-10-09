import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwdGhRZXepHED0pr6D-OHF237uBQYjqOY",
  authDomain: "docs-458e6.firebaseapp.com",
  databaseURL: "https://docs-458e6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "docs-458e6",
  storageBucket: "docs-458e6.appspot.com",
  messagingSenderId: "369589084501",
  appId: "1:369589084501:web:e3665d199c69f406488fdc",
  measurementId: "G-QLX3VQKJYQ"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app();
}

export default firebase