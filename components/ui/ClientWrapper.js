"use client";
import { useNotificationChecker } from "@/hooks/useNotificationChecker";
import { useFcm } from "@/hooks/useFcm";

export default function ClientWrapper({ children }) {
    useNotificationChecker();
    useFcm();

    return (
        <>
            {children}
        </>
    );
}


