'use client';

import { Search as SearchIcon } from 'lucide-react';
import styles from './search.module.scss';
import { useRef, useState, useEffect } from 'react';
import { useDebounce } from '@uidotdev/usehooks';
import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '@/services/actions';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';

interface SearchBarProps {
  className?: string;
}

export default function SearchBar({ className }: SearchBarProps) {
  const [keyword, setKeyword] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const debouncedKeyword = useDebounce(keyword, 500);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedKeyword],
    queryFn: () => searchMovies(debouncedKeyword, 6),
    enabled: debouncedKeyword.trim().length >= 2,
  });

  const movies = data?.items || [];
  const cdnImage = data?.APP_DOMAIN_CDN_IMAGE || '';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      ref={wrapperRef}
      className={clsx(styles.searchWrapper, className)}
    >
      <SearchIcon className={styles.searchIcon} size={18} />
      <input
        value={keyword}
        onChange={(e) => {
          setKeyword(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        type="text"
        placeholder="Tìm kiếm phim..."
        className={styles.searchInput}
      />

      {/* <div className={clsx(styles.resultWrapper, { [styles.visible]: isOpen && (keyword.length >= 2) })}> */}
        <div className={clsx(styles.resultWrapper, { [styles.isVisible]: isOpen && (keyword.length >= 2) })}>
        <div className={styles.resultList}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.loadingIcon} />
              Đang tìm kiếm...
            </div>
          ) : movies.length > 0 ? (
            <>
              {movies.map((movie) => (
                <Link 
                  key={movie._id} 
                  href={`/phim/${movie.slug}`} 
                  className={styles.resultItem}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={styles.itemThumb}>
                     <Image 
                        src={`${cdnImage}/uploads/movies/${movie.thumb_url}`} 
                        alt={movie.name}
                        width={48}
                        height={64}
                        className={styles.thumbImage}
                     />
                  </div>
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{movie.name}</h4>
                    <p className={styles.itemSub}>{movie.origin_name} ({movie.year})</p>
                  </div>
                </Link>
              ))}
              <Link 
                href={`/search?keyword=${keyword}`} 
                className={styles.viewAll}
                onClick={() => setIsOpen(false)}
              >
                Xem tất cả kết quả
              </Link>
            </>
          ) : debouncedKeyword.length >= 2 ? (
            <div className={styles.noResult}>
              Không tìm thấy phim nào phù hợp.
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
