// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// import { getMessaging, getToken, onMessage } from "firebase/messaging";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBtCLZ1_vGqeVPIfT2TdqwgAEHzGy3bPPI",
//   authDomain: "wyecare-4b25e.firebaseapp.com",
//   projectId: "wyecare-4b25e",
//   storageBucket: "wyecare-4b25e.appspot.com",
//   messagingSenderId: "925855734592",
//   appId: "1:925855734592:web:e1a62965d64bb25552b8a5",
//   measurementId: "G-MW5LJWNZCL"
// };


// // Initialize Firebase
// export const firebaseApp = initializeApp(firebaseConfig);


// export const messaging = getMessaging(firebaseApp);

// export const requestforToken = (setTokenFound) => {
//     return getToken(messaging, {vapidKey: 'BJ0IG24kKtHL7NcQAuPHdZdI-ZrPe5Qdw-pT_2dBXu1RHNqdxhAqLPoGpid_nM7tW0tulcCm2GTmJ6i2Av8wKmo'}).then((currentToken) => {
//       if (currentToken) {
//         console.log('current token for client: ', currentToken);
//         setTokenFound(true);
//         // Track the token -> client mapping, by sending to backend server
//         // show on the UI that permission is secured
//       } else {
//         console.log('No registration token available. Request permission to generate one.');
//         setTokenFound(false);
//         // shows on the UI that permission is required 
//       }
//     }).catch((err) => {
//       console.log('An error occurred while retrieving token. ', err);
//       // catch error while creating client token
//     });
//   }
// export const onMessageLIstner = () =>{
//     return new Promise((resolve)=>{
//         onMessage((messaging, payload)=>{
//             console.log(payload, "payload")
//             resolve(payload);
//         })
//     })
// }

// const analytics = getAnalytics(firebaseApp);
