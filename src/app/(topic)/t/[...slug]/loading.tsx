import GallerySkeleton from "@/components/Features/Gallery/Skeleton";

export default function Loading() {
  return (
    <main className="pt-24 px-4 md:px-8 lg:px-16">
      <section className="max-w-screen-2xl mx-auto">
        <header className="mb-8 space-y-4">
          <div className="h-8 w-48 bg-gray-800 rounded animate-pulse" />
          <div className="h-10 w-full max-w-2xl bg-gray-800/50 rounded-lg animate-pulse" />
        </header>
        <GallerySkeleton />
      </section>
    </main>
  );
}
