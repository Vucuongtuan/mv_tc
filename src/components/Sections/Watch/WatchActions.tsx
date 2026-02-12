'use client';

import { Share2, AlertTriangle, List, Server, Cpu, ExternalLink, Sparkles } from 'lucide-react';
import st from './watch-page.module.scss';
import { clsx } from 'clsx';
import { EpisodeServer } from '@/types/type';

interface WatchActionsProps {
  servers: EpisodeServer[];
  selectedServerIndex: number;
  onServerChange: (index: number) => void;
  isEmbed: boolean;
  onToggleMode: () => void;
  isAmbientMode: boolean;
  onToggleAmbientMode: () => void;
}

export default function WatchActions({ 
  servers, 
  selectedServerIndex, 
  onServerChange,
  isEmbed,
  onToggleMode,
  isAmbientMode,
  onToggleAmbientMode
}: WatchActionsProps) {
  return (
    <div className={st.actionRow}>
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2 bg-[#262626] rounded-lg p-1 border border-white/5">
          <div className="px-3 flex items-center gap-2 text-white/40 text-xs font-bold uppercase tracking-wider border-r border-white/10">
            <Server size={14} /> Server
          </div>
          <div className="flex gap-1 px-1">
            {servers.map((server, idx) => (
              <button
                key={idx}
                onClick={() => onServerChange(idx)}
                className={clsx(
                  "px-3 py-1.5 rounded-md text-xs font-bold transition-all backdrop-blur-xl",
                  selectedServerIndex === idx 
                    ? "bg-[#e50914] text-white shadow-lg" 
                    : "text-white  hover:bg-white/5 hover:text-white"
                )}
              >
                #{idx + 1}
              </button>
            ))}
          </div>
        </div>

        {/* Player Mode Toggle */}
        <button 
          onClick={onToggleMode}
          className={clsx(
            st.btnAction,
            isEmbed && "text-amber-500 bg-amber-500/10 border-amber-500/20"
          )}
        >
          {isEmbed ? (
            <><ExternalLink size={16} /> Player: Embed (Dự phòng)</>
          ) : (
            <><Cpu size={16} /> Player: HLS (Chính)</>
          )}
        </button>

        {!isEmbed && (
          <button 
            onClick={onToggleAmbientMode}
            className={clsx(
              st.btnAction,
              isAmbientMode && "text-[#e50914] bg-[#e50914]/10 border-[#e50914]/20"
            )}
            title='Đây là tính năng beta tăng trải nghiệm xem phim có thể làm giật lag giảm trải nghiệm người dùng.'
          >
            <Sparkles size={16} />
            {isAmbientMode ? 'Tắt Ambient' : 'Bật Ambient'}
          </button>
        )}

      </div>

      <div className="flex gap-4">
        <button className={st.btnAction}><Share2 /> Chia sẻ</button>
        <button className={clsx(st.btnAction, "opacity-50 cursor-not-allowed")} disabled title="Chức năng đang bảo trì">
          <AlertTriangle /> Báo lỗi
        </button>
      </div>
    </div>
  );
}
