
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function MovieCarouselLoading() {
  return (
    <div className="flex flex-col items-center justify-center w-full py-16 gap-3">
      <Loader2 size={28} className="animate-spin text-white/40" />
      <span className="text-sm text-white/30 font-medium">Đang tải...</span>
    </div>
  );
}
