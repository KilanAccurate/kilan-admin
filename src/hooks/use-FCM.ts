// src/hooks/useFCM.ts
"use client";

import { useEffect } from "react";
import { app, messaging } from "@/lib/firebase";
import { getToken as firebaseGetToken, getMessaging, onMessage } from "firebase/messaging";
import { useAuth } from "@/app/context/AuthContext";
import { ApiService } from "@/api/api-service";
import { ApiEndpoints } from "@/api/endpoints";
import { toast } from "sonner";

const vapidKey = "BAk6pebh1EvauXhb-M3gr0PFR1yc-PVN7fNGmVhQSw-a_f1KFTQthW24XMIuShZNZ7PRmavo1PsaqZJeJ301zDQ";

export function useFCM() {
    useEffect(() => {
        if (typeof window === "undefined") return; // prevent SSR

        const messaging = getMessaging(app);

        async function registerToken() {
            try {
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    console.log("Notification permission not granted");
                    return;
                }

                const currentToken = await getToken(messaging, { vapidKey });
                if (currentToken) {
                    // Send token to backend
                    const now = new Date().toISOString();
                    await ApiService.put(ApiEndpoints.UPDATEFCM, {
                        fcmToken: currentToken,
                        fcmTokenIssuedAt: now,
                    });
                    console.log("FCM Token registered:", currentToken);
                } else {
                    console.log("No registration token available.");
                }
            } catch (err) {
                console.error("Error getting FCM token", err);
            }
        }

        registerToken();

        // Listen to foreground messages (optional)
        const unsubscribeMessage = onMessage(messaging, (payload) => {
            try {
                console.log("🔥 Foreground FCM received:", payload);

                const title = payload.notification?.title ?? payload.data?.title ?? "No title";
                const body = payload.notification?.body ?? payload.data?.body ?? "No body";

                toast(title, {
                    description: body,
                });
            } catch (e) {
                console.error("Error in onMessage handler:", e);
            }
        });


        // Optionally, re-register token every X minutes (e.g., 1 hour)
        const intervalId = setInterval(() => {
            registerToken();
        }, 1000 * 60 * 60); // every 1 hour

        return () => {
            unsubscribeMessage();
            clearInterval(intervalId);
        };
    }, []);
}

function getToken(messaging: any, { vapidKey }: { vapidKey: string; }) {
    return firebaseGetToken(messaging, { vapidKey });
}