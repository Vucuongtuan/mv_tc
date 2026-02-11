
import React from 'react';

export default function MovieCarouselLoading() {
  return (
    <div className="relative w-full h-[280px] md:h-[350px] overflow-hidden rounded-xl bg-white/5 border border-white/10">
      <div className="absolute inset-0 backdrop-blur-sm animate-pulse bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      
      <div className="absolute bottom-0 left-0 p-6 w-full space-y-3">
        <div className="h-6 w-1/3 bg-white/10 rounded-lg animate-pulse" />
        <div className="h-4 w-1/2 bg-white/5 rounded-lg animate-pulse" />
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
         <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
         <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse" />
      </div>
    </div>
  );
}
