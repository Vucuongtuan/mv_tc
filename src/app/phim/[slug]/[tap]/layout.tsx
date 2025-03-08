import { getDetailMovie, getDetailMovieServer2 } from "@/api/movie.api";
import { IMovieTap } from "@/types/movie.types";
import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
// export const dynamic = "no-cache";

type Props = {
  params: Promise<{ slug: string; tap: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug, tap } = await params;
  const product = await getDetailMovie(slug);
  const previousImages = (await parent).openGraph?.images || [];
  const image = process.env.BASE_IMAGE_URL + product?.data.item.poster_url;
  const tapReple = tap === "full" ? `FULL` : `Tập ${tap.split("-")[1]}`;
  return {
    title: product?.data.seoOnPage.titleHead,
    description: product?.data.seoOnPage.descriptionHead,
    openGraph: {
      title: `${product?.data.seoOnPage.titleHead} | ${tapReple}`,
      description: product?.data.seoOnPage.descriptionHead,
      images: [{ url: image, width: 800, height: 600 }, ...previousImages],
    },
  };
}
export default async function PhimLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug: string; tap: string }>;
}>) {
  const { slug, tap } = await params
  const tapp = tap ? parseInt(tap.split("-")[1]?.trim()) : 1;
  const [resServer1, resServer2] = await Promise.all([
    getDetailMovie(slug),
    getDetailMovieServer2(slug)
  ]);
  const tapMovie1 = resServer1.data.item.episodes[0].server_data;
  const tapMovie2 = resServer2.episodes[0].server_data;
  const longerTapMovie = tapMovie1.length >= tapMovie2.length ? tapMovie1 : tapMovie2;

  return (
    <main className="p-2 h-full w-full ">
      <div className="w-full h-full flex min-[200px]:max-lg:flex-col ">
        {children}
        <div className="w-full h-auto hidden min-[200px]:max-lg:block">
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 p-4">
            {longerTapMovie.map((item: IMovieTap) => (
              <Link
                href={`/phim/${resServer1.data.item.slug}/tap-${item.slug}`}
                key={item.slug}
                className={`p-2 text-center rounded-lg transition-all hover:bg-red-500 hover:text-white
                  ${tapp.toString() === item.slug
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-800"}`}
              >
                Tập {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="w-1/4 hidden lg:block ml-4">
          <div className="sticky top-4  rounded-lg border shadow-sm">
            <div className="p-3 border-b">
              <h3 className="font-semibold">Danh sách tập</h3>
            </div>
            <div className="h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-4 gap-2 p-3">
                {longerTapMovie.map((item: IMovieTap) => (
                  <Link
                    href={`/phim/${resServer1.data.item.slug}/tap-${item.slug}`}
                    key={item.slug}
                    className={`flex items-center justify-center p-2 rounded-md transition-all hover:bg-red-500 hover:text-white
                      ${tapp.toString() === item.slug
                        ? "bg-red-600 text-white"
                        : "bg-gray-100 text-gray-800"}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
