importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.10.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDd_44xy9naaIhgjY_Ikv73LdhZq78A9Ws",
  authDomain: "todo-44034.firebaseapp.com",
  projectId: "todo-44034",
  storageBucket: "todo-44034.appspot.com",
  messagingSenderId: "711287731990",
  appId: "1:711287731990:web:fbb4c6aac2de3c4ea64237",
  measurementId: "G-GKYH0GPTXW"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('🔕 [Service Worker] Powiadomienie w tle:', payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/icon.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
