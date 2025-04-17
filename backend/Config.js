// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDd_44xy9naaIhgjY_Ikv73LdhZq78A9Ws",
  authDomain: "todo-44034.firebaseapp.com",
  projectId: "todo-44034",
  storageBucket: "todo-44034.firebasestorage.app",
  messagingSenderId: "711287731990",
  appId: "1:711287731990:web:fbb4c6aac2de3c4ea64237",
  measurementId: "G-GKYH0GPTXW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//onst analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider(); 

export const db = getFirestore(app)