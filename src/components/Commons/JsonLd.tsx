import { HeroSlideData } from '@/types/type';
import { getImageUrl } from '@/utils/mapperData';

export function MovieJsonLd({ movie }: { movie: HeroSlideData }) {
  const baseUrl = process.env.URL || 'http://localhost:3000';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    "name": movie.title,
    "url": `${baseUrl}/phim/${movie.slug}`,
    "image": getImageUrl(movie.images?.primaryPoster, 'w500'),
    "description": movie.content?.replace(/<[^>]*>?/gm, '').slice(0, 160),
    "dateCreated": movie.year,
    "director": movie.director?.map(name => ({
      "@type": "Person",
      "name": name
    })),
    "actor": movie.actor?.map(name => ({
      "@type": "Person",
      "name": name
    })),
    "aggregateRating": movie.rating > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": movie.rating,
      "bestRating": "10",
      "worstRating": "1",
      "ratingCount": "100" // Giá trị giả định nếu API không trả về
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function BreadcrumbJsonLd({ items }: { items: { name: string; item: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.item
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const baseUrl = process.env.URL || 'http://localhost:3000';
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "TC Phim",
    "url": baseUrl,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
