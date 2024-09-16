import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
import {getFirestore} from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyB0PUvrfO6ZOCyEXX8WbccS2GSustwztlw",
  authDomain: "email-clone-9b1e4.firebaseapp.com",
  projectId: "email-clone-9b1e4",
  storageBucket: "email-clone-9b1e4.appspot.com",
  messagingSenderId: "552750735310",
  appId: "1:552750735310:web:d1d2b365f8946867f8559f",
  measurementId: "G-KRDW5GVC74"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider(app)
export const database = getFirestore(app)