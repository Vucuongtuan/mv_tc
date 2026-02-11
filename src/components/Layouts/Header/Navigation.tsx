import Link from 'next/link';
import styles from './header.module.scss';

const menuItems = [
  { label: 'Chủ Đề', href: '/t/chu-de' },
  { label: 'Thể Loại', href: '/t/the-loai' },
  { label: 'Phim Lẻ', href: '/t/phim-le' },
  { label: 'Phim Bộ', href: '/t/phim-bo' },
  { label: 'Xem Chung', href: '/t/xem-chung', isNew: true },
];

export { menuItems };

export default function Navigation() {
  return (
    <nav className={styles.nav}>
      {menuItems.map((item) => (
        <Link key={item.href} href={item.href} className={styles.navLink}>
          {item.isNew && <span className={styles.newBadge}>NEW</span>}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
