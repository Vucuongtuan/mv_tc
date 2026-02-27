import Link from 'next/link';
import styles from './header.module.scss';
import { Sparkles } from 'lucide-react';

const menuItems = [
  { label: 'Phim Lẻ', href: '/t/phim-le' },
  { label: 'Phim Bộ', href: '/t/phim-bo' },
  { label: 'Anime', href: '/t/hoat-hinh'},
  { label: 'TV Show', href: '/t/tv-shows'},
];

export { menuItems };

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} className={styles.navLink}>
          {item.label}
        </Link>
      ))}
      <Link href="/ai-chat" className={styles.aiNavLink}>
        <Sparkles size={14} className={styles.aiNavIcon} />
        <span>AI Phim</span>
        <span className={styles.aiBadge}>NEW</span>
      </Link>
    </nav>
  );
}
