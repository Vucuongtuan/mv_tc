import Link from 'next/link';
import Image from 'next/image';
import styles from './movie-result-item.module.scss';
import { Movie } from '@/types/type';

interface MovieResultItemProps {
  movie: Movie | null;
  cdnImage?: string;
  subtitle?: string;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function MovieResultItem({
  movie,
  cdnImage,
  subtitle,
  isLoading,
  onClick,
  className,
}: MovieResultItemProps) {
  if (isLoading) {
    return (
      <div className={`${styles.resultItem} ${className || ''}`}>
        <div className={styles.itemThumb}>
          <div className={styles.thumbSkeleton} />
        </div>
        <div className={styles.itemInfo}>
          <div className={styles.itemName}>{subtitle || 'Đang tìm...'}</div>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className={`${styles.resultItem} ${className || ''}`}>
        <div className={styles.itemThumb}>
          <div className={styles.thumbPlaceholder}>🎬</div>
        </div>
        <div className={styles.itemInfo}>
          <div className={styles.itemName}>{subtitle || 'Không tìm thấy'}</div>
        </div>
      </div>
    );
  }

  const thumbUrl = cdnImage
    ? `${cdnImage}/${movie.thumb_url}`
    : movie.thumb_url;

  const defaultSubtitle = `${movie.origin_name || ''}${movie.year ? ` (${movie.year})` : ''}`;

  const content = (
    <>
      <div className={styles.itemThumb}>
        <Image
          src={thumbUrl}
          alt={movie.name}
          width={48}
          height={64}
          className={styles.thumbImage}
        />
      </div>
      <div className={styles.itemInfo}>
        <h4 className={styles.itemName}>{movie.name}</h4>
        <p className={styles.itemSub}>{subtitle || defaultSubtitle}</p>
      </div>
    </>
  );

  return (
    <Link
      href={`/phim/${movie.slug}`}
      className={`${styles.resultItem} ${className || ''}`}
      onClick={onClick}
    >
      {content}
    </Link>
  );
}
