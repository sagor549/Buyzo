import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD6XoaLy_ycSwYEUzaJ6F5D7ME2sXK0oF8",
  authDomain: "buyzo-3f98c.firebaseapp.com",
  projectId: "buyzo-3f98c",
  storageBucket: "buyzo-3f98c.firebasestorage.app",
  messagingSenderId: "523555228880",
  appId: "1:523555228880:web:cff5e0e3b1c9b071baa2d5",
  measurementId: "G-CZCTN28QYT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

export { auth, firestore };