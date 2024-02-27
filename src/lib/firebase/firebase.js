import { initializeApp } from "firebase/app"
import { GoogleAuthProvider, getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCwdGhRZXepHED0pr6D-OHF237uBQYjqOY",
  authDomain: "docs-458e6.firebaseapp.com",
  databaseURL:
    "https://docs-458e6-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "docs-458e6",
  storageBucket: "docs-458e6.appspot.com",
  messagingSenderId: "369589084501",
  appId: "1:369589084501:web:e3665d199c69f406488fdc",
  measurementId: "G-QLX3VQKJYQ",
}

const firebase = initializeApp(firebaseConfig)
const auth = getAuth(firebase)
const database = getDatabase(firebase)
const GoogleProvider = new GoogleAuthProvider()

export { firebase, auth, database, GoogleProvider }
