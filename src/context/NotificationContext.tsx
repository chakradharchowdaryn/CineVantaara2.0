import React, { createContext, useContext, useState, useMemo } from 'react';
import { NotificationItem } from '../types';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => void;
}

const DEFAULT_ALERTS: NotificationItem[] = [
  {
    id: 'alert-admin-1',
    userId: 'ALL',
    title: '🛡️ [ADMIN ANNOUNCEMENT] Platform Release Notice',
    message: 'Welcome to CineVantaara Cinema Network. Cryptographic E2EE active for all creative talent communications.',
    type: 'SYSTEM',
    timestamp: '1 hour ago',
    isRead: false,
    linkUrl: '/dashboard'
  },
  {
    id: 'alert-opp-1',
    userId: 'ALL',
    title: '🎬 [DIRECTOR CASTING CALL] "Echoes of the Silver Screen"',
    message: 'Director posted a feature film casting call for Actor / DP.',
    type: 'OPPORTUNITY_MATCH',
    timestamp: '3 hours ago',
    isRead: false,
    linkUrl: '/opportunities'
  }
];

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('cv_notifications');
      if (saved) {
        const parsed: NotificationItem[] = JSON.parse(saved);
        // Strictly only allow director/producer opportunities and admin important messages
        const clean = parsed.filter(n => n.type === 'OPPORTUNITY_MATCH' || n.type === 'SYSTEM');
        return clean.length > 0 ? clean : DEFAULT_ALERTS;
      }
    } catch (e) {}
    return DEFAULT_ALERTS;
  });

  const isCreatorOfAlert = (item: NotificationItem) => {
    if (!currentUser || item.type !== 'OPPORTUNITY_MATCH') return false;
    if (item.creatorId && (item.creatorId === currentUser.id || item.creatorId === currentUser.email)) return true;
    if (item.creatorEmail && currentUser.email && item.creatorEmail.toLowerCase() === currentUser.email.toLowerCase()) return true;
    if (item.creatorName && currentUser.name && item.creatorName.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) return true;
    return false;
  };

  // The user who shared the opportunity should NOT see the alert; all other users see it!
  const visibleNotifications = useMemo(() => {
    return notifications.filter(n => {
      if (n.type !== 'OPPORTUNITY_MATCH' && n.type !== 'SYSTEM') return false;
      if (isCreatorOfAlert(n)) return false;
      return true;
    });
  }, [notifications, currentUser]);

  const unreadCount = visibleNotifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(item => (item.id === id ? { ...item, isRead: true } : item));
      try {
        localStorage.setItem('cv_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(item => ({ ...item, isRead: true }));
      try {
        localStorage.setItem('cv_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addNotification = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'isRead'>) => {
    // Strictly only permit director/producer opportunities and admin important broadcast messages
    if (item.type !== 'OPPORTUNITY_MATCH' && item.type !== 'SYSTEM') {
      return; // Never show collaboration requests or direct chat messages in alerts
    }

    const newNotif: NotificationItem = {
      ...item,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      isRead: false
    };

    setNotifications(prev => {
      const filtered = prev.filter(n => n.type === 'OPPORTUNITY_MATCH' || n.type === 'SYSTEM');
      const updated = [newNotif, ...filtered];
      try {
        localStorage.setItem('cv_notifications', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications: visibleNotifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
