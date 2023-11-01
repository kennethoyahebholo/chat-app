import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyAp17a0GQw6hjtGlT9yalwJuScY6MlC5_k",
  authDomain: "mychat-app-e4779.firebaseapp.com",
  projectId: "mychat-app-e4779",
  storageBucket: "mychat-app-e4779.appspot.com",
  messagingSenderId: "854333406406",
  appId: "1:854333406406:web:3a0105aa9c0f0a76e5ebc7",
  measurementId: "G-PFW5Z90Q9D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const storage = getStorage(app)
export const db = getFirestore(app)
// const analytics = getAnalytics(app);