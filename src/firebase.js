import firebase from "firebase";
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD1J2BUETpN7mb6Zf07OZidLc8_tXW_jTo",
  authDomain: "docs-12481.firebaseapp.com",
  projectId: "docs-12481",
  storageBucket: "docs-12481.appspot.com",
  messagingSenderId: "585557916104",
  appId: "1:585557916104:web:4577569eade73a2a7068fd",
  measurementId: "G-DB4SYMNJ5G"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}else {
  firebase.app();
}

export default firebase