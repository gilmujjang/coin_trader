import firebase from "firebase"
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/storage";
import dotenv from 'dotenv'
dotenv.config()

const firebaseConfig = {
  apiKey: process.env.FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.FIREBASE_PUBLIC_AUTH_ODOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PUBLIC_PROJECT_ID,
  storageBucket: process.env.FIREBASE_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_PUBLIC_MESSAGINGSENDER_ID,
  appId: process.env.FIREBASE_PUBLIC_APP_ID
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // if already initialized, use that one
}

export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();
export const storageService = firebase.storage();