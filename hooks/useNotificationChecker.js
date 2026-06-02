"use client";
import { useEffect } from "react";

export function useNotificationChecker() {
    useEffect(() => {
        const checkReminders = () => {
            const now = new Date();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            // Example: Daily reminder at 5:00 PM
            if (hours === 17 && minutes === 0) {
                triggerLocalNotification(
                    "Shift End Reminder",
                    "It's 5:00 PM. Please ensure all employees have checked out today."
                );
            }

            // Example: Morning briefing at 9:00 AM
            if (hours === 9 && minutes === 0) {
                triggerLocalNotification(
                    "Morning Briefing",
                    "Welcome! Check the directory for new employee onboarding today."
                );
            }
        };

        const triggerLocalNotification = (title, body) => {
            // Trigger FCM-like logic locally for demonstration
            const history = JSON.parse(localStorage.getItem("notification_history") || "[]");
            const newEntry = {
                id: Date.now(),
                title,
                body,
                time: new Date().toISOString(),
                read: false
            };
            localStorage.setItem("notification_history", JSON.stringify([newEntry, ...history].slice(0, 50)));
            window.dispatchEvent(new Event("notification_update"));

            // If browser notification permission is granted, show it
            if (Notification.permission === "granted") {
                new Notification(title, { body, icon: '/logo.png' });
            }
        };

        // Check every minute
        const interval = setInterval(checkReminders, 60000);
        return () => clearInterval(interval);
    }, []);
}
