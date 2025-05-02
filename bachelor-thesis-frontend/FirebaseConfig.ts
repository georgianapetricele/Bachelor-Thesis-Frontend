// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {initializeAuth, getReactNativePersistence} from "firebase/auth";
import ReactNativeAsyncStorage  from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAb7flCTmsG-xlXY0U4ZjrBscsUx2YzY7I",
  authDomain: "bachelor-thesis-auth.firebaseapp.com",
  projectId: "bachelor-thesis-auth",
  storageBucket: "bachelor-thesis-auth.firebasestorage.app",
  messagingSenderId: "475110435569",
  appId: "1:475110435569:web:232067911247fd8a4e5750"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

