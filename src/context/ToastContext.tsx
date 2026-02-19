"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastMessage {
    id: string;
    message: string;
    type: 'success' | 'error';
    visible: boolean;
}

interface ToastContextType {
    showToast: (message: string, type?: 'success' | 'error') => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => { } });

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        const newToast = { id, message, type, visible: true };

        setToasts(prev => [...prev, newToast]);

        // Auto remove after 3s
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 3000);
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center p-4 rounded-lg shadow-xl backdrop-blur-md border border-white/10 transition-all duration-300 transform translate-y-0 opacity-100 min-w-[300px]
                            ${toast.type === 'success' ? 'bg-emerald-900/90 text-white' : 'bg-red-900/90 text-white'}
                        `}
                    >
                        {toast.type === 'success' ? <CheckCircle className="h-5 w-5 mr-3 text-emerald-400" /> : <XCircle className="h-5 w-5 mr-3 text-red-400" />}
                        <div className="flex-1 text-sm font-medium">{toast.message}</div>
                        <button onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))} className="ml-3 text-white/50 hover:text-white">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => useContext(ToastContext);
