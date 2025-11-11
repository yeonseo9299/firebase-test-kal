// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmVCsz3saARcsXXQEe7zSwoRYcmW_69tU",
  authDomain: "kalguksiu.firebaseapp.com",
  projectId: "kalguksiu",
  storageBucket: "kalguksiu.firebasestorage.app",
  messagingSenderId: "991594485251",
  appId: "1:991594485251:web:06882b7db4926462c6a036",
  measurementId: "G-K81LZM5T7J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app); 