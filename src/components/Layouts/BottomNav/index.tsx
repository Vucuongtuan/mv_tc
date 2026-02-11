'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Film, Tv, User } from 'lucide-react';
import styles from './bottom-nav.module.scss';
import { useAuth } from '@/hooks/useAuth';
import clsx from 'clsx';
import { motion } from 'framer-motion';

const navItems = [
  { label: 'Trang chủ', href: '/', icon: Home },
  { label: 'Phim lẻ', href: '/t/phim-le', icon: Film },
  { label: 'Phim bộ', href: '/t/phim-bo', icon: Tv },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { isLoggedIn, login } = useAuth();

  return (
    <nav className={clsx(styles.bottomNav, 'liquid-glass-dark')}>
      <div className={styles.container}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={clsx(styles.navItem, { [styles.active]: isActive })}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className={styles.activeIndicator}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon size={24} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <button 
          className={clsx(styles.navItem, styles.authItem)} 
          onClick={() => !isLoggedIn && login()}
        >
          <User size={24} />
          <span>{isLoggedIn ? 'Cá nhân' : 'Đăng nhập'}</span>
        </button>
      </div>
    </nav>
  );
}
