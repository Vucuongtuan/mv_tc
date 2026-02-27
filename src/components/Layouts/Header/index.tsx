import styles from './header.module.scss';

// Server Components
import Logo from './Logo';
import Navigation from './Navigation';

// Client Components
import AuthButton, { AuthButtonClient } from './AuthButton';
import TVModeToggle from '@/components/Features/TVMode/TVModeToggle';

import HeaderBackground from './HeaderBackground';
import { Suspense } from 'react';
import SearchBar from '@/components/Features/Search';

export default function Header() {
  return (
    <header className={styles.header}>
      <Suspense fallback={null}>
        <HeaderBackground />
      </Suspense>
      <div className={styles.container}>
        <Logo />
        <SearchBar />
        <Navigation />

        <div className={styles.rightSection}>
          <TVModeToggle />
          <Suspense fallback={<AuthButtonClient />}>
            <AuthButton />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
