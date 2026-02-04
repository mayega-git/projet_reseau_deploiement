/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { toast } from 'sonner';
import {
  CheckCircle,
  XCircle,
  Info,
  AlertTriangle,
  Loader,
} from 'lucide-react';

type ToastType = 'positive' | 'error' | 'update';

interface ToastOptions {
  message: string;
  description?: string;
  type: ToastType;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// export function GlobalNotifier({
//   message,
//   description,
//   type,
//   action,
// }: ToastOptions) {
//   let icon, className;
//   switch (type) {
//     case 'positive':
//       icon = <CheckCircle className="text-green-500" />;
//       className = 'bg-green-100 border-green-500 text-green-800';
//       break;
//     case 'error':
//       icon = <XCircle className="text-red-500" />;
//       className = 'bg-red-100 border-red-500 text-red-800';
//       break;
//     case 'update':
//       icon = <Info className="text-yellow-500" />;
//       className = 'bg-yellow-100 border-yellow-500 text-yellow-800';
//       break;
//     default:
//       icon = null;
//       className = '';
//   }

//   toast(message, {
//     description,
//     icon,
//     className,
//     action,
//   });
// }

export const GlobalNotifier = (
  message: string,
  type: 'success' | 'info' | 'warning' | 'error' | 'loading',
  description?: string // Optional description for additional details
) => {
switch (type) {
    case 'success':
      toast.success(message, {
        duration: 4000,
        icon: <CheckCircle className="text-green-500" />,
        description,
        className:
          'bg-green-50 border-green-500 text-green-800 rounded-lg shadow-md',
      });
      break;
    case 'info':
      toast.info(message, {
        duration: 4000,
        icon: <Info className="text-blue-500" />,
        description,
        className:
          'bg-blue-100 border-blue-500 text-blue-800 rounded-lg shadow-md',
      });
      break;
    case 'warning':
      toast.warning(message, {
        duration: 4000,
        icon: <AlertTriangle className="text-yellow-500" />,
        description,
        className:
          'bg-yellow-100 border-yellow-500 text-yellow-800 rounded-lg shadow-md',
      });
      break;
    case 'error':
      toast.error(message, {
        duration: 4000,
        icon: <XCircle className="text-red-500" />,
        description,
        className:
          'bg-red-100 border-red-500 text-red-800 rounded-lg shadow-md',
      });
      break;
    case 'loading':
      toast.loading(message, {
        duration: 4000,
        icon: <Loader className="text-gray-500 animate-spin" />,
        description,
        className:
          'bg-gray-100 border-gray-500 text-gray-800 rounded-lg shadow-md',
      });
      break;
    default:
      toast(message, {
        duration: 4000,
        description,
        className:
          'bg-gray-100 border-gray-500 text-gray-800 rounded-lg shadow-md',
      });
  }
};
