importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js");

firebase.initializeApp({
apiKey: "AIzaSyBaNjHmi-VlW8aFDDVN38OJkQCShYY2sFg",
  authDomain: "dominos-ftw.firebaseapp.com",
  databaseURL: "https://dominos-ftw-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "dominos-ftw",
  storageBucket: "dominos-ftw.firebasestorage.app",
  messagingSenderId: "476741872461",
  appId: "1:476741872461:web:3dc979b05a6175eadda504",
  measurementId: "G-1TBL91595F"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body
  });
});
