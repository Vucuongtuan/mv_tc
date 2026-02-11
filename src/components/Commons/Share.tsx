"use client";

import { Share2 } from "lucide-react";



export default function Share({title, year}: {title: string, year: number}) {
        const handleShare = async () => {
        const shareData = {
            title: title,
            text: `Xem phim ${title} (${year}) cực hay tại đây!`,
            url: typeof window !== 'undefined' ? window.location.href : '',
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                alert('Đã sao chép liên kết vào bộ nhớ tạm!');
            }
        } catch (err) {
            console.error('Error sharing:', err);
        }
    };
    return (
      <button onClick={handleShare} className={'py-4 px-5 sm:px-6 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 font-bold text-base sm:text-base uppercase tracking-wider hover:bg-white/10 transition-colors'} aria-label="Chia sẻ phim">
         <Share2 size={20} />
       </button>
    );
}