// lib/firebase.ts
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

const base64Config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG;

if (!base64Config) {
    throw new Error("Firebase config not found in environment variables");
}

const decodedConfig = JSON.parse(
    Buffer.from(base64Config, "base64").toString("utf-8")
);

export const app = initializeApp(decodedConfig);

export const messaging =
    typeof window !== "undefined" ? getMessaging(app) : null;
