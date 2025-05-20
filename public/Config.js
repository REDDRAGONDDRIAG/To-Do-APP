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

export const googleApiConfig = {
  apiKey: 'AIzaSyD3La22SUaYz8sSbU_9_bAIoqgnbSSVdgQ',
  clientId: '143686676735-lrl09teodhigadr4m7m3k7klaabb0ndf.apps.googleusercontent.com',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
  scope: 'https://www.googleapis.com/auth/calendar'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleAuthProvider = new GoogleAuthProvider(); 
export const db = getFirestore(app)
export const messaging = getMessaging(app);
