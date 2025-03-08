import { MetadataRoute } from "next";
import { getDetailMovie } from "@/api/movie.api";

export default async function sitemap({
  params,
}: {
  params: { slug: string };
}): Promise<MetadataRoute.Sitemap> {
  const res = await getDetailMovie(params.slug);
  return res.data.map((product: any) => ({
    url: `${process.env.URL}/details/${product.slug}`,
    lastModified: product.create_product,
    priority: 0.8,
  }));
}
