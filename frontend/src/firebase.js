// firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: // Firebase api koy,
  authDomain: "habersitesi-3dfaf.firebaseapp.com",
  projectId: "habersitesi-3dfaf",
  storageBucket: "habersitesi-3dfaf.firebasestorage.app",
  messagingSenderId: "544603290645",
  appId: "1:544603290645:web:c6d2e96128e615484ae21c"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Auth ve Firestore referanslarını oluştur
const auth = getAuth(app);
const db = getFirestore(app);

// Dışa aktar
export { auth, db };
