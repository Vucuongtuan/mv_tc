import Link from 'next/link';
import styles from './header.module.scss';

export default function Logo() {
  return (
    <Link href="/" className={styles.logo}>
      <span className={styles.logoIcon}>TC</span>
      <span className={styles.logoText}>Phim</span>
    </Link>
  );
}
