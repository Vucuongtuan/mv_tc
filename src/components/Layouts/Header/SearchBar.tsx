'use client';

import { Search } from 'lucide-react';
import styles from './header.module.scss';
import { useRef } from 'react';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleWrapperClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div 
      className={`${styles.searchWrapper} ${className || ''}`}
      onClick={handleWrapperClick}
    >
      <Search className={styles.searchIcon} size={18} />
      <input
        ref={inputRef}
        type="text"
        placeholder="Tìm kiếm phim..."
        className={styles.searchInput}
      />
    </div>
  );
}
