import React from 'react';
import Link from 'next/link';
import { getGenreWithPreview } from '@/services/movie';
import styles from './genre-discovery.module.scss';
import { ChevronRight } from 'lucide-react';
import GenreGrid from './GenreGrid';

const GenreDiscovery: React.FC = async () => {
  const genres = await getGenreWithPreview();

  if (!genres || genres.length === 0) {
    return null;
  }

  return (
    <section className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Khám Phá Thể Loại</h2>
        <Link href="/t/the-loai/hanh-dong" className={styles.viewAll}>
          Xem tất cả <ChevronRight size={16} />
        </Link>
      </header>
      <GenreGrid genres={genres} />
    </section>
  );
};

export default GenreDiscovery;
