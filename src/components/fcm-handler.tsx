// src/components/FCMHandler.tsx
"use client";

import { useFCM } from "@/hooks/use-FCM";


export default function FCMHandler() {
    useFCM();
    return null;
}
