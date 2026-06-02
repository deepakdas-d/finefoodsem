"use client";
import { useEffect } from "react";
import { FiX } from "react-icons/fi";

export default function Modal({ isOpen, onClose, title, children, footer, maxWidth = "500px" }) {
    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            window.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
        }
        return () => {
            window.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content glass animate-zoom-in"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth }}
            >
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    -webkit-backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                }

                .modal-content {
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                    position: relative;
                }

                .modal-header {
                    padding: 1.5rem 1.5rem 1rem 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    border-bottom: 1px solid var(--card-border);
                }

                .modal-header h2 {
                    font-size: 1.25rem;
                    font-weight: 700;
                    color: var(--foreground);
                    margin: 0;
                }

                .close-btn {
                    color: var(--text-muted);
                    font-size: 1.5rem;
                    transition: all 0.2s;
                }

                .close-btn:hover {
                    color: var(--error);
                    transform: rotate(90deg);
                }

                .modal-body {
                    padding: 1.5rem;
                    overflow-y: auto;
                    max-height: 70vh;
                }

                .modal-footer {
                    padding: 1rem 1.5rem;
                    border-top: 1px solid var(--card-border);
                    background: rgba(0, 0, 0, 0.05);
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    border-bottom-left-radius: 12px;
                    border-bottom-right-radius: 12px;
                }

                @keyframes zoomIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }

                .animate-zoom-in {
                    animation: zoomIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                }
            `}</style>
        </div>
    );
}
