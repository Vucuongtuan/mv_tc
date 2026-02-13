import { MetadataRoute } from 'next'
import { getSlugGenerateStaticParams, getTopicParams, getFilterList } from "@/services/movie";

export const dynamic = 'force-dynamic';
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.URL || 'http://localhost:3000'

  let movieEntries: MetadataRoute.Sitemap = []
  try {
    const movieSlugs = await getSlugGenerateStaticParams(new Date());
    movieEntries = (movieSlugs || []).map((movie) => ({
      url: `${baseUrl}/phim/${movie.slug}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    }))
  } catch (error) {
    console.error('Error fetching movie slugs for sitemap:', error);
  }

  let topicEntries: MetadataRoute.Sitemap = []
  try {
    const [topics, categories, countries] = await Promise.all([
      getTopicParams(),
      getFilterList({ slug: 'the-loai' }),
      getFilterList({ slug: 'quoc-gia' })
    ]);

    if (topics) {
      topicEntries.push(...topics.map(t => ({
        url: `${baseUrl}/t/${t.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })));
    }

    if (categories?.data?.items) {
      topicEntries.push(...categories.data.items.map(c => ({
        url: `${baseUrl}/t/the-loai/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })));
    }

    if (countries?.data?.items) {
      topicEntries.push(...countries.data.items.map(c => ({
        url: `${baseUrl}/t/quoc-gia/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      })));
    }
  } catch (error) {
    console.error('Error fetching topics for sitemap:', error);
  }

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    }
  ]

  return [...staticRoutes, ...topicEntries, ...movieEntries]
}
