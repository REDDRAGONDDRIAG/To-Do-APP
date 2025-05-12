import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-firestore.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";
import { getMessaging, onMessage, getToken } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging.js";

const firebaseConfig = {
  apiKey: "AIzaSyDd_44xy9naaIhgjY_Ikv73LdhZq78A9Ws",
  authDomain: "todo-44034.firebaseapp.com",
  projectId: "todo-44034",
  storageBucket: "todo-44034.appspot.com",
  messagingSenderId: "711287731990",
  appId: "1:711287731990:web:fbb4c6aac2de3c4ea64237",
  measurementId: "G-GKYH0GPTXW"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider(); 
export const db = getFirestore(app)
export const messaging = getMessaging(app);