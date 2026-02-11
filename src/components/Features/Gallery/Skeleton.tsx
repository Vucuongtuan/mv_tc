
export default function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div 
          key={i} 
          className="aspect-[2/3] w-full h-full bg-gray-800 rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}