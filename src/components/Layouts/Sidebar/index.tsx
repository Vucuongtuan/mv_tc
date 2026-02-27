import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { menuItems } from '@/components/Layouts/Header/Navigation';
import Logo from '@/components/Layouts/Header/Logo';
import AuthButton, { AuthButtonClient } from '@/components/Layouts/Header/AuthButton';
import TVModeToggle from '@/components/Features/TVMode/TVModeToggle';
import { Suspense } from 'react';
import { Home, Search, Film, Tv, Monitor } from 'lucide-react';
import styles from './sidebar.module.scss';

export default function TVSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <div className={styles.topSection}>
        <div className={styles.logoWrapper}>
          <Logo />
        </div>

        <nav className={styles.nav}>
          <Link
            href="/"
            className={cn(styles.navLink, pathname === '/' && styles.active)}
            tabIndex={0}
          >
            <Home size={24} />
            <span>Trang chủ</span>
          </Link>

          <Link
            href="/search"
            className={cn(styles.navLink, pathname.startsWith('/search') && styles.active)}
            tabIndex={0}
          >
            <Search size={24} />
            <span>Tìm kiếm</span>
          </Link>

          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(styles.navLink, pathname.startsWith(item.href) && styles.active)}
              tabIndex={0}
            >
              {item.label === 'Phim Lẻ' && <Film size={24} />}
              {item.label === 'Phim Bộ' && <Tv size={24} />}
              {/* Fallback icon for others if needed */}
              {!['Phim Lẻ', 'Phim Bộ'].includes(item.label) && <Monitor size={24} />}
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className={styles.bottomSection}>
         <div className="mb-4 w-full">
            <TVModeToggle className="w-full justify-start" />
         </div>

         <div className={styles.authWrapper}>
            <Suspense fallback={<AuthButtonClient />}>
              <AuthButton />
            </Suspense>
         </div>
      </div>
    </aside>
  );
}
