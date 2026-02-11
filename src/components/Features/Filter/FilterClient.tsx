'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useState, useCallback, useTransition, useMemo, useEffect } from 'react';
import styles from './filter.module.scss';

export interface FilterItem {
  _id: string;
  name: string;
  slug: string;
}

export type FilterCategory = 'topic' | 'country' | 'genre';

interface FilterState {
  country: string;
  category: string; // genre/category in API
  year: string;
  sortField: string;
  sortType: string;
}

interface FilterClientProps {
  countries?: FilterItem[];
  genres?: FilterItem[];
  category?: FilterCategory;
  currentSlug?: string;
}

const YEARS: FilterItem[] = [
  { _id: 'all-year', name: 'Tất Cả', slug: '' },
  { _id: 'year-2026', name: '2026', slug: '2026' },
  ...Array.from({ length: 15 }, (_, i) => {
    const year = 2025 - i;
    return { _id: `year-${year}`, name: year.toString(), slug: year.toString() };
  }),
];

const SORT_OPTIONS: FilterItem[] = [
  { _id: 'sort-modified', name: 'Mới Cập Nhật', slug: 'modified.time' },
  { _id: 'sort-year', name: 'Năm Phát Hành', slug: 'year' },
  { _id: 'sort-id', name: 'Mới Nhất', slug: '_id' },
];

export default function FilterClient({ 
  countries = [], 
  genres = [],
  category = 'topic',
  currentSlug = '',
}: FilterClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const buildFilterState = useCallback((): FilterState => ({
    country: category === 'country' ? currentSlug : (searchParams.get('country') || ''),
    category: category === 'genre' ? currentSlug : (searchParams.get('category') || ''),
    year: searchParams.get('year') || '',
    sortField: searchParams.get('sort_field') || 'modified.time',
    sortType: searchParams.get('sort_type') || 'desc',
  }), [category, currentSlug, searchParams]);

  const [filters, setFilters] = useState<FilterState>(buildFilterState);

  useEffect(() => {
    setFilters(buildFilterState());
  }, [buildFilterState]);

  const activeFiltersCount = useMemo(() => [
    filters.country,
    filters.category,
    filters.year,
    filters.sortField !== 'modified.time' ? filters.sortField : '',
  ].filter(Boolean).length, [filters]);

  const handleFilterChange = useCallback((key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleApplyFilters = useCallback(() => {
    const params = new URLSearchParams();
    let basePath = pathname;

    // Determine base path based on primary filter selection
    if (filters.country && category !== 'country') {
      basePath = `/t/quoc-gia/${filters.country}`;
    } else if (filters.category && category !== 'genre') {
      basePath = `/t/the-loai/${filters.category}`;
    } else if (category === 'country' && filters.country && filters.country !== currentSlug) {
      basePath = `/t/quoc-gia/${filters.country}`;
    } else if (category === 'genre' && filters.category && filters.category !== currentSlug) {
      basePath = `/t/the-loai/${filters.category}`;
    }

    // Add remaining filters as query params (matching API spec)
    if (filters.country && !basePath.includes('/t/quoc-gia/')) {
      params.set('country', filters.country);
    }
    if (filters.category && !basePath.includes('/t/the-loai/')) {
      params.set('category', filters.category);
    }
    if (filters.year) params.set('year', filters.year);
    if (filters.sortField && filters.sortField !== 'modified.time') {
      params.set('sort_field', filters.sortField);
    }
    if (filters.sortType && filters.sortType !== 'desc') {
      params.set('sort_type', filters.sortType);
    }

    const queryString = params.toString();
    const finalUrl = queryString ? `${basePath}?${queryString}` : basePath;

    startTransition(() => {
      router.push(finalUrl);
    });
    setIsOpen(false);
  }, [filters, router, pathname, category, currentSlug]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      country: category === 'country' ? currentSlug : '',
      category: category === 'genre' ? currentSlug : '',
      year: '',
      sortField: 'modified.time',
      sortType: 'desc',
    });
    startTransition(() => {
      router.push(pathname);
    });
  }, [router, pathname, category, currentSlug]);

  const toggleCollapse = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // Add "Tất Cả" option at the beginning
  const countryOptions: FilterItem[] = [{ _id: 'all-country', name: 'Tất Cả', slug: '' }, ...countries];
  const genreOptions: FilterItem[] = [{ _id: 'all-genre', name: 'Tất Cả', slug: '' }, ...genres];

  return (
    <div className={styles.filterContainer}>
      {/* Collapse Header */}
      <button className={styles.filterHeader} onClick={toggleCollapse}>
        <div className={styles.headerLeft}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z" />
          </svg>
          <span>Bộ Lọc</span>
          {activeFiltersCount > 0 && (
            <span className={styles.filterBadge}>{activeFiltersCount}</span>
          )}
        </div>
        <svg 
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={2} 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      <div className={`${styles.filterContent} ${isOpen ? styles.open : ''}`}>
        <div className={styles.filterBody}>
          {/* Country */}
          {countryOptions.length > 1 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Quốc gia:</span>
              <div className={styles.filterOptions}>
                {countryOptions.map((item) => (
                  <button
                    key={item._id}
                    className={`${styles.filterOption} ${filters.country === item.slug ? styles.active : ''}`}
                    onClick={() => handleFilterChange('country', item.slug)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Genre/Category */}
          {genreOptions.length > 1 && (
            <div className={styles.filterGroup}>
              <span className={styles.filterLabel}>Thể loại:</span>
              <div className={styles.filterOptions}>
                {genreOptions.map((item) => (
                  <button
                    key={item._id}
                    className={`${styles.filterOption} ${filters.category === item.slug ? styles.active : ''}`}
                    onClick={() => handleFilterChange('category', item.slug)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Year */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Năm:</span>
            <div className={styles.filterOptions}>
              {YEARS.map((item) => (
                <button
                  key={item._id}
                  className={`${styles.filterOption} ${filters.year === item.slug ? styles.active : ''}`}
                  onClick={() => handleFilterChange('year', item.slug)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Sắp xếp:</span>
            <div className={styles.filterOptions}>
              {SORT_OPTIONS.map((item) => (
                <button
                  key={item._id}
                  className={`${styles.filterOption} ${filters.sortField === item.slug ? styles.active : ''}`}
                  onClick={() => handleFilterChange('sortField', item.slug)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.filterActions}>
            <button 
              className={`${styles.btnFilter} ${styles.btnPrimary}`} 
              onClick={handleApplyFilters}
              disabled={isPending}
            >
              {isPending ? (
                'Đang lọc...'
              ) : (
                <>
                  Lọc kết quả
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </>
              )}
            </button>
            <button 
              className={`${styles.btnFilter} ${styles.btnSecondary}`} 
              onClick={handleResetFilters}
              disabled={isPending}
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
