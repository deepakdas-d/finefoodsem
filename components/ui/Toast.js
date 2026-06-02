"use client";
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext();

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = "info", duration = 3000) => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="toast-container">
                {toasts.map((toast) => (
                    <div key={toast.id} className={`toast toast-${toast.type} animate-slide-in`}>
                        <span className="toast-icon">
                            {toast.type === "success" && <FiCheckCircle />}
                            {toast.type === "error" && <FiAlertCircle />}
                            {toast.type === "info" && <FiInfo />}
                        </span>
                        <span className="toast-message">{toast.message}</span>
                        <button className="toast-close" onClick={() => removeToast(toast.id)}>
                            <FiX />
                        </button>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .toast-container {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    z-index: 10000;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    pointer-events: none;
                }

                .toast {
                    pointer-events: auto;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 20px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.1);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                    color: white;
                    min-width: 300px;
                    max-width: 450px;
                }

                .toast-success {
                    border-left: 4px solid var(--success);
                }

                .toast-error {
                    border-left: 4px solid var(--error);
                }

                .toast-info {
                    border-left: 4px solid var(--primary);
                }

                .toast-icon {
                    font-size: 1.25rem;
                    display: flex;
                    align-items: center;
                }

                .toast-success .toast-icon { color: var(--success); }
                .toast-error .toast-icon { color: var(--error); }
                .toast-info .toast-icon { color: var(--primary); }

                .toast-message {
                    flex: 1;
                    font-size: 0.95rem;
                    font-weight: 500;
                }

                .toast-close {
                    color: rgba(255, 255, 255, 0.5);
                    transition: color 0.2s;
                }

                .toast-close:hover {
                    color: white;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                .animate-slide-in {
                    animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>
        </ToastContext.Provider>
    );
}

export const useToast = () => useContext(ToastContext);
