importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyDKIztoDOTYXa4z564cS2v8wWBi5SvPS14",
    authDomain: "finefoodsem.firebaseapp.com",
    projectId: "finefoodsem",
    storageBucket: "finefoodsem.firebasestorage.app",
    messagingSenderId: "1090570030082",
    appId: "1:1090570030082:web:fd73b911a2bee74e3feb1b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/logo.png'
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
