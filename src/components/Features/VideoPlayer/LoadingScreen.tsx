
import st from "./video-player.module.scss"
import { Loader2 } from "lucide-react";

export default function LoadingScreen({ minimal = false }: { minimal?: boolean }) {
    if (minimal) {
        return (
            <div className={st.loadingOverlay}>
                <Loader2 size={36} className="animate-spin text-white/80" />
            </div>
        );
    }

    return (
          <div className={st.loadingState}>
            <div className="absolute inset-0 bg-gradient-to-br from-[#1a2332] to-[#2d3e50]" />
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
              <p className={st.loadingText}>Bạn đang xem phim tại: TC Phim</p>
              <p className={st.subText}>Chúc bạn xem phim vui vẻ!</p>
              <div className="flex items-center gap-2">
                <Loader2 className="animate-spin" />
                <p>Đang tải phim...</p>
              </div>
            </div>
          </div>
    );
}