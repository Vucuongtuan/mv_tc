import SearchPageClient from "@/components/Features/SearchPage";
import { getFilterList } from "@/services/movie";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tìm kiếm phim | TC Phim",
  description: "Tìm kiếm phim hoặc nhờ AI gợi ý phim phù hợp với sở thích của bạn",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const genresRes = await getFilterList({ slug: "the-loai" });
  const genres = genresRes?.data?.items || [];
  const params = await searchParams;
  const initialKeyword = typeof params.keyword === 'string' ? params.keyword : '';

  return (
    <main className="pt-20 min-h-screen">
      <SearchPageClient genres={genres} initialKeyword={initialKeyword} />
    </main>
  );
}
