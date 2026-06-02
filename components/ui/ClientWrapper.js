"use client";
import { useNotificationChecker } from "@/hooks/useNotificationChecker";
import { ToastProvider } from "@/components/ui/Toast";

export default function ClientWrapper({ children }) {
    useNotificationChecker();

    return (
        <ToastProvider>
            {children}
        </ToastProvider>
    );
}
