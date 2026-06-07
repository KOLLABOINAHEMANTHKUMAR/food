import React from 'react';
import { X, CheckCircle, Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotificationToast() {
  const { notifications } = useApp();

  if (notifications.length === 0) return null;

  const iconMap = {
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    info: <Info className="h-5 w-5 text-blue-500" />,
    warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
    error: <AlertOctagon className="h-5 w-5 text-red-500" />
  };

  const borderMap = {
    success: 'border-emerald-100 bg-white/95 text-slate-800 shadow-emerald-50',
    info: 'border-blue-100 bg-white/95 text-slate-800 shadow-blue-50',
    warning: 'border-amber-100 bg-white/95 text-slate-800 shadow-amber-50',
    error: 'border-red-100 bg-white/95 text-slate-800 shadow-red-50'
  };

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {notifications.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 border rounded-2xl shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-auto ${
            borderMap[toast.type] || borderMap.info
          }`}
        >
          <div className="flex-shrink-0 mt-0.5">
            {iconMap[toast.type] || iconMap.info}
          </div>
          <div className="flex-1 text-xs font-semibold leading-relaxed">
            {toast.message}
          </div>
        </div>
      ))}
    </div>
  );
}
