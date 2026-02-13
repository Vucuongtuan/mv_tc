'use client';

import { useState } from 'react';
import { Menu, X, Search, User, LogOut } from 'lucide-react';
import Link from 'next/link';
import { menuItems } from './Navigation';
import styles from './header.module.scss';
import { useAuth } from '@/hooks/useAuth';

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, login, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      logout();
    } else {
      login();
    }
    closeMenu();
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        className={styles.mobileMenuBtn}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      <div
        className={`${styles.mobileOverlay} ${isOpen ? styles.active : ''}`}
        onClick={closeMenu}
      />

      {/* Navigation Drawer */}
      <nav className={`${styles.mobileNav} ${isOpen ? styles.active : ''}`}>
        <div className={styles.mobileNavHeader}>
          <Link href="/" className={styles.logo} onClick={closeMenu}>
            <span className={styles.logoIcon}>TC</span>
            <span className={styles.logoText}>Phim</span>
          </Link>
          <button
            className={styles.closeBtn}
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        {/* Mobile Search */}
        <div className={styles.mobileSearch}>
          <Search className={styles.searchIcon} size={18} />
          <input
            type="text"
            placeholder="Tìm kiếm phim..."
            className={styles.searchInput}
          />
        </div>

        {/* Menu Items */}
        <div className={styles.mobileMenuItems}>
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={closeMenu}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Mobile Member Button */}
        <div className={styles.mobileFooter}>
          <button className={styles.mobileMemberButton} onClick={handleAuthAction}>
            {isLoggedIn ? <LogOut size={20} /> : <User size={20} />}
            <span>{isLoggedIn ? 'Đăng xuất' : 'Đăng nhập'}</span>
          </button>
        </div>
      </nav>
    </>
  );
}
