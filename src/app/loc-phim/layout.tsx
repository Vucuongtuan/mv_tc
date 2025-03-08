import { getListOption, getMovie, getMovieByOption } from "@/api/movie.api";
import FormLoc from "./form";
import PaginationLoc from "../../components/pagination/pagination";

export default async function LocLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { type: string };
}>) {
  const [category, country] = await Promise.all([
    getListOption("the-loai"),
    getListOption("quoc-gia"),
  ]);

  return (
    <main className="w-full h-auto px-2">
      <FormLoc
        category={category.data.items}
        country={country.data.items}
        params={params.type}
      />
      {children}
      <section className="w-full h-[100px] py-8 px-6">
        <PaginationLoc params={params.type} />
      </section>
    </main>
  );
}
