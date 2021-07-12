import firebase from "firebase"
import "@firebase/auth";
import "@firebase/firestore";
import "@firebase/storage";
import  apikey from '../etc/apikey.js'

const firebaseConfig = {
  apiKey: apikey.FIREBASE_PUBLIC_API_KEY,
  authDomain: apikey.FIREBASE_PUBLIC_AUTH_ODOMAIN,
  databaseURL: apikey.FIREBASE_DATABASE_URL,
  projectId: apikey.FIREBASE_PUBLIC_PROJECT_ID,
  storageBucket: apikey.FIREBASE_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: apikey.FIREBASE_PUBLIC_MESSAGINGSENDER_ID,
  appId: apikey.FIREBASE_PUBLIC_APP_ID
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