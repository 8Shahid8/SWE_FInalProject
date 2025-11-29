import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCWOcy6bAkEw7iD7fu13Yz0wECG2199pRY",
  authDomain: "safehands-37385.firebaseapp.com",
  projectId: "safehands-37385",
  storageBucket: "safehands-37385.firebasestorage.app",
  messagingSenderId: "940411073036",
  appId: "1:940411073036:web:e2004967b979b369887429",
  measurementId: "G-FRLSYFJ9XT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
