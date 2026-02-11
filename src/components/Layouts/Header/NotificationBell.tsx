'use client';

import { Bell } from 'lucide-react';
import styles from './header.module.scss';

export default function NotificationBell() {
  const handleClick = () => {
    // TODO: Open notifications panel
    console.log('Notifications clicked');
  };

  return (
    <button 
      className={styles.iconButton} 
      onClick={handleClick}
      aria-label="Notifications"
    >
      <Bell size={22} />
    </button>
  );
}
