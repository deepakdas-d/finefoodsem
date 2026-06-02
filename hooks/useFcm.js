"use client";
import { useEffect, useState } from "react";
import { messaging } from "@/lib/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { useToast } from "@/components/ui/Toast";

export function useFcm() {
    const [token, setToken] = useState(null);
    const { addToast } = useToast();

    const requestPermission = async () => {
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                const msg = await messaging();
                if (msg) {
                    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
                    if (!vapidKey || vapidKey.startsWith("BH-")) {
                        console.error("Missing or invalid VAPID key in .env.local");
                        addToast("Notifications setup required: Please add a valid VAPID key to .env.local", "warning");
                        return;
                    }

                    const currentToken = await getToken(msg, { vapidKey });
                    if (currentToken) {
                        setToken(currentToken);
                        console.log("FCM Token:", currentToken);
                        addToast("Notifications enabled successfully!", "success");
                    }
                }
            } else {
                addToast("Notification permission denied", "error");
            }
        } catch (err) {
            console.error("Error getting FCM token:", err);
            if (err.code === 'messaging/invalid-vapid-key') {
                addToast("Invalid VAPID key configuration", "error");
            } else {
                addToast("Failed to enable notifications", "error");
            }
        }
    };

    useEffect(() => {
        const setupListener = async () => {
            const msg = await messaging();
            if (msg) {
                onMessage(msg, (payload) => {
                    console.log("Foreground message received:", payload);
                    addToast(payload.notification.title + ": " + payload.notification.body, "info");

                    // Save to history (could be Firestore or local state)
                    saveNotificationToHistory(payload.notification);
                });
            }
        };

        if (typeof window !== "undefined") {
            setupListener();
        }
    }, [addToast]);

    const saveNotificationToHistory = (notification) => {
        const history = JSON.parse(localStorage.getItem("notification_history") || "[]");
        const newEntry = {
            id: Date.now(),
            title: notification.title,
            body: notification.body,
            time: new Date().toISOString(),
            read: false
        };
        localStorage.setItem("notification_history", JSON.stringify([newEntry, ...history].slice(0, 50)));
        window.dispatchEvent(new Event("notification_update"));
    };

    return { token, requestPermission };
}
