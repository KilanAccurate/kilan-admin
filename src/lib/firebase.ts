// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyDpVW5B8sx7aPACM64xPxP5K8qGTFC7vYI",
    authDomain: "kilan-accurate.firebaseapp.com",
    projectId: "kilan-accurate",
    storageBucket: "kilan-accurate.firebasestorage.app",
    messagingSenderId: "396860509364",
    appId: "1:396860509364:web:fac9c5d31272e32a105be1",
    measurementId: "G-7RENG0SRP9"
};

export const app = initializeApp(firebaseConfig);

export const messaging = typeof window !== "undefined" ? getMessaging(app) : null;
