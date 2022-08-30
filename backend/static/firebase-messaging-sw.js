importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
 importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

 // Initialize the Firebase app in the service worker by passing the generated config
 const firebaseConfig = {
    apiKey: "AIzaSyBtCLZ1_vGqeVPIfT2TdqwgAEHzGy3bPPI",
    authDomain: "wyecare-4b25e.firebaseapp.com",
    projectId: "wyecare-4b25e",
    storageBucket: "wyecare-4b25e.appspot.com",
    messagingSenderId: "925855734592",
    appId: "1:925855734592:web:e1a62965d64bb25552b8a5",
    measurementId: "G-MW5LJWNZCL"
  };

 firebase.initializeApp(firebaseConfig);

 // Retrieve firebase messaging
 const messaging = firebase.messaging();
 messaging.onBackgroundMessage((payload) => {
   console.log("Received background message ", payload, "kundiiii");

   const notificationTitle = payload.notification.title;
   const notificationOptions = {
     body: payload.notification.body,
   };

   self.registration.showNotification(notificationTitle, notificationOptions);
 });