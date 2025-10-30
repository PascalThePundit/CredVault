// utils/notifications.ts
import toast, { ToastOptions } from 'react-hot-toast';

export const showNotification = (
  title: string,
  message: string,
  type: 'success' | 'error' | 'info' | 'warning' = 'info'
) => {
  const options: ToastOptions = {
    duration: 5000,
    position: 'top-right',
  };

  switch (type) {
    case 'success':
      toast.success(`${title}: ${message}`, options);
      break;
    case 'error':
      toast.error(`${title}: ${message}`, options);
      break;
    case 'warning':
      toast(`${title}: ${message}`, {
        ...options,
        icon: '⚠️',
      });
      break;
    default:
      toast(`${title}: ${message}`, options);
  }
};