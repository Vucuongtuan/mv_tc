import AiChat from "@/components/Features/SearchPage/AiChat";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Gợi ý phim | TC Phim",
  description: "Mô tả phim bạn muốn xem, AI sẽ gợi ý cho bạn những bộ phim phù hợp nhất",
};

export default function AiChatPage() {
  return (
    <main className="pt-20 min-h-screen max-w-screen-2xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-16">
      <section className="flex flex-col items-center text-center py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
          AI Gợi ý phim
        </h1>
        <p className="text-sm md:text-base text-white/50 mb-8 max-w-md">
          Mô tả phim bạn muốn xem, AI sẽ gợi ý cho bạn
        </p>
      </section>
      <AiChat />
    </main>
  );
}
