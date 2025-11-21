// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCFjVfz8pn7GURtXMusjQl-1Nj1pK0GRns",
  authDomain: "qrmenu-184f5.firebaseapp.com",
  projectId: "qrmenu-184f5",
  storageBucket: "qrmenu-184f5.firebasestorage.app",
  messagingSenderId: "613402777726",
  appId: "1:613402777726:web:a39562b7784a947792a02f"
};


// Bu sətirləri əlavə etməyi unutmayın:
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);