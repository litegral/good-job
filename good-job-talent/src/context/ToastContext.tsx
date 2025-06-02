import React, { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

type ToastType = 'success' | 'error';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (message: string, type: ToastType) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      hideToast(id);
    }, 4000);
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast }}>
      {children}
      <ToastContainer toasts={toasts} hideToast={hideToast} />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC<{ toasts: Toast[], hideToast: (id: string) => void }> = ({ 
  toasts,
  hideToast
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center justify-between p-4 shadow-lg rounded-lg min-w-[300px] max-w-md transition-all transform-gpu 
            ${toast.type === 'success' 
              ? 'bg-green-50 border-l-4 border-green-500' 
              : 'bg-red-50 border-l-4 border-red-500'
            }`}
        >
          <div className="flex items-center">
            {toast.type === 'success' ? (
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            )}
            <p className={toast.type === 'success' ? 'text-green-800' : 'text-red-800'}>
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => hideToast(toast.id)}
            className="ml-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}; 