'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchMovies } from '@/services/actions';
import { Movie } from '@/types/type';
import MovieCard from '../MovieCard';
import styles from './search-page.module.scss';
import { Search, Sparkles, Film } from 'lucide-react';
import { useDebounce } from '@uidotdev/usehooks';
import AiChat from './AiChat';

interface Genre {
  _id: string;
  name: string;
  slug: string;
}

interface SearchPageClientProps {
  genres: Genre[];
  initialKeyword?: string;
}

export default function SearchPageClient({ genres, initialKeyword = '' }: SearchPageClientProps) {
  const [mode, setMode] = useState<'search' | 'ai'>('search');
  const [keyword, setKeyword] = useState(initialKeyword);
  const [activeGenre, setActiveGenre] = useState('');
  const debouncedKeyword = useDebounce(keyword, 400);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchTerm = activeGenre || debouncedKeyword;

  const { data, isLoading } = useQuery({
    queryKey: ['search-page', searchTerm],
    queryFn: () => searchMovies(searchTerm, 24),
    enabled: searchTerm.trim().length >= 2 && mode === 'search',
    staleTime: 1000 * 60 * 3,
  });

  const movies = data?.items || [];
  const cdnImage = data?.APP_DOMAIN_CDN_IMAGE || '';

  const handleGenreClick = useCallback((genre: Genre) => {
    if (activeGenre === genre.name) {
      setActiveGenre('');
      setKeyword('');
    } else {
      setActiveGenre(genre.name);
      setKeyword(genre.name);
    }
  }, [activeGenre]);

  const handleSearchSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setActiveGenre('');
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value);
    setActiveGenre('');
  }, []);

  useEffect(() => {
    if (mode === 'search' && inputRef.current) {
      inputRef.current.focus();
    }
  }, [mode]);

  return (
    <div className={styles.searchPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <h1 className={styles.title}>
          {mode === 'search' ? 'Tìm kiếm phim' : 'AI Gợi ý phim'}
        </h1>
        <p className={styles.subtitle}>
          {mode === 'search'
            ? 'Nhập tên phim, diễn viên, hoặc chọn thể loại bên dưới'
            : 'Mô tả phim bạn muốn xem, AI sẽ gợi ý cho bạn'}
        </p>

        {/* Mode Toggle */}
        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${mode === 'search' ? styles.active : ''}`}
            onClick={() => setMode('search')}
          >
            <Search size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -1 }} />
            Tìm kiếm
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'ai' ? styles.active : ''}`}
            onClick={() => setMode('ai')}
          >
            <Sparkles size={14} style={{ display: 'inline', marginRight: 6, verticalAlign: -1 }} />
            AI Gợi ý
          </button>
        </div>

        {/* Search Mode */}
        {mode === 'search' && (
          <>
            <form onSubmit={handleSearchSubmit} className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={20} />
              <input
                ref={inputRef}
                type="text"
                value={keyword}
                onChange={handleInputChange}
                placeholder="Tìm phim, diễn viên, đạo diễn..."
                className={styles.searchInput}
              />
              {keyword && (
                <button type="button" className={styles.searchSubmit} onClick={() => { setKeyword(''); setActiveGenre(''); }}>
                  ✕
                </button>
              )}
            </form>

            {/* Genre Tags */}
            <div className={styles.genreSection}>
              <span className={styles.genreLabel}>Thể loại phổ biến</span>
              <div className={styles.genreTags}>
                {genres.slice(0, 14).map((genre) => (
                  <button
                    key={genre._id}
                    className={`${styles.genreTag} ${activeGenre === genre.name ? styles.active : ''}`}
                    onClick={() => handleGenreClick(genre)}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </section>

      {/* AI Mode */}
      {mode === 'ai' && <AiChat />}

      {/* Search Results */}
      {mode === 'search' && searchTerm.trim().length >= 2 && (
        <section className={styles.resultsSection}>
          {isLoading ? (
            <div className={styles.loadingWrapper}>
              <div className={styles.spinner} />
              <span className={styles.loadingText}>Đang tìm kiếm...</span>
            </div>
          ) : movies.length > 0 ? (
            <>
              <div className={styles.resultsHeader}>
                <h2 className={styles.resultsTitle}>
                  Kết quả {activeGenre ? `thể loại "${activeGenre}"` : `cho "${keyword}"`}
                </h2>
                <span className={styles.resultsCount}>{movies.length} phim</span>
              </div>
              <ul className={styles.resultsGrid}>
                {movies.map((movie: Movie) => (
                  <li key={movie._id}>
                      <MovieCard
                        movie={{
                          ...movie,
                          thumb_url: cdnImage ? `${cdnImage}/uploads/movies/${movie.thumb_url}` : movie.thumb_url,
                          poster_url: cdnImage ? `${cdnImage}/uploads/movies/${movie.poster_url}` : movie.poster_url,
                        }}
                        activeHover={true}
                      />
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className={styles.emptyState}>
              <Film className={styles.emptyIcon} size={48} />
              <h3 className={styles.emptyTitle}>Không tìm thấy phim</h3>
              <p className={styles.emptyDesc}>
                Thử tìm với từ khóa khác hoặc chuyển sang chế độ AI để nhận gợi ý thông minh
              </p>
            </div>
          )}
        </section>
      )}

      {/* Initial state */}
      {mode === 'search' && searchTerm.trim().length < 2 && (
        <div className={styles.emptyState}>
          <Search className={styles.emptyIcon} size={48} />
          <h3 className={styles.emptyTitle}>Bắt đầu tìm kiếm</h3>
          <p className={styles.emptyDesc}>
            Nhập từ khóa hoặc chọn thể loại phía trên để tìm phim yêu thích
          </p>
        </div>
      )}
    </div>
  );
}
