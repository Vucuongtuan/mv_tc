'use client';

import { User } from 'lucide-react';
import styles from './header.module.scss';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function AuthButton() {
  const { isLoggedIn, loading, login, logout } = useAuth();

  useEffect(() => {
    console.log("AuthButton mounted/updated", { isLoggedIn, loading });
  }, [isLoggedIn, loading]);

  if (loading) {
    return <AuthButtonClient />;
  }

  if (isLoggedIn) {
    return (
      <button className={styles.memberButton} onClick={logout}>
        <User size={18} />
        <span>Thành viên</span>
      </button>
    );
  }

  return (
    <button className={styles.memberButton} onClick={login}>
      <User size={18} />
      <span>Đăng nhập</span>
    </button>
  );
}

export function AuthButtonClient() {
  return (
    <div className={styles.memberButtonSkeleton}></div>
  );
}
