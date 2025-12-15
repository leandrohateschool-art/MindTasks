import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({ 
  message, 
  actionLabel, 
  onAction, 
  isVisible, 
  onClose,
  duration = 4000
}) => {
  useEffect(() => {
    if (isVisible && duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300 w-[90%] max-w-sm">
      <div className="bg-zinc-800 text-white px-4 py-3.5 rounded-xl shadow-2xl flex items-center justify-between border border-zinc-700/50 backdrop-blur-md">
        <span className="text-sm font-medium text-zinc-200">{message}</span>
        {actionLabel && (
          <button 
            onClick={onAction}
            className="text-blue-400 hover:text-blue-300 text-sm font-bold uppercase tracking-wide transition-colors ml-4 px-2 py-1 hover:bg-white/5 rounded"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
};
