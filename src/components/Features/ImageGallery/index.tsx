import st from './masonry-gallery.module.scss';
import Image from '@/components/Commons/Image';
import { getImageUrl } from '@/utils/mapperData';
import { ResolvedImage } from '@/types/type';
import { clsx } from 'clsx';
import { Expand } from 'lucide-react';

interface MasonryGalleryProps {
  images: ResolvedImage[];
  title?: string;
  className?: string;
}

export default function MasonryGallery({ images, title = 'Thư viện ảnh', className }: MasonryGalleryProps) {
  if (!images || images.length === 0) return null;

  return (
    <section className={clsx(st.gallerySection, className)} aria-labelledby="gallery-heading">
      <h3 id="gallery-heading" className={st.title}>{title}</h3>
      <div className={st.masonryGrid}>
        {images.map((img, index) => {
          const imgUrl = getImageUrl(img, 'original');
          if (!imgUrl) return null;
          return (
            <figure key={index} className={st.gridItem}>
              <div 
                className={st.imageWrapper} 
                style={{ paddingBottom: `${(img.height / img.width) * 100}%` }}
              >
                <Image 
                  src={imgUrl} 
                  alt={`Movie image ${index + 1}`} 
                  fill 
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className={st.image}
                  loading="lazy"
                />
              </div>
            </figure>
          );
        })}
      </div>
    </section>
  );
}
