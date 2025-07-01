import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { clsx } from 'clsx';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  duration?: number;
}

interface SimpleNotificationProps {
  notification: Notification;
  onRemove: (id: string) => void;
}

function SimpleNotification({ notification, onRemove }: SimpleNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification
    setTimeout(() => setIsVisible(true), 100);

    // Auto remove after duration
    const duration = notification.duration || 5000;
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(notification.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [notification.id, notification.duration, onRemove]);

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={20} className="text-red-500" />;
      case 'info':
      default:
        return <Info size={20} className="text-blue-500" />;
    }
  };

  const getColors = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800';
      case 'error':
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800';
      case 'info':
      default:
        return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800';
    }
  };

  return (
    <div
      className={clsx(
        'transform transition-all duration-300 ease-out mb-3',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      )}
    >
      <div className={clsx('p-4 rounded-lg border shadow-lg', getColors())}>
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {notification.message}
            </p>
          </div>
          
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => onRemove(notification.id), 300);
            }}
            className="flex-shrink-0 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={16} className="text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Global notification manager
class NotificationManager {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.notifications]));
  }

  show(notification: Omit<Notification, 'id'>) {
    const id = Math.random().toString(36).substring(2, 15);
    const newNotification = { ...notification, id };
    this.notifications.push(newNotification);
    this.notify();
  }

  remove(id: string) {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notify();
  }

  success(title: string, message: string, duration?: number) {
    this.show({ type: 'success', title, message, duration });
  }

  error(title: string, message: string, duration?: number) {
    this.show({ type: 'error', title, message, duration });
  }

  info(title: string, message: string, duration?: number) {
    this.show({ type: 'info', title, message, duration });
  }
}

export const notificationManager = new NotificationManager();

// Notification container component with higher z-index
export function NotificationContainer() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = notificationManager.subscribe(setNotifications);
    return unsubscribe;
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[10001] max-w-sm w-full">
      {notifications.map((notification) => (
        <SimpleNotification
          key={notification.id}
          notification={notification}
          onRemove={notificationManager.remove.bind(notificationManager)}
        />
      ))}
    </div>
  );
}

export default SimpleNotification;