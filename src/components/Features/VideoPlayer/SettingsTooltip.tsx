"use client"

import { memo, useEffect, useRef, useState } from "react";
import st from "./video-player.module.scss";
import clsx from "clsx";
import { Check } from "lucide-react";


interface SettingsTooltipProps {
  isOpen: boolean;
  onClose: () => void;
  playbackRate: number;
  onPlaybackRateChange: (rate: number) => void;
  aspectRatio: string;
  onAspectRatioChange: (ratio: string) => void;
  position: { x: number; y: number };
  servers?: any[];
  selectedServerIndex?: number;
  onServerChange?: (index: number) => void;
}

const ASPECT_RATIOS = [
  { label: 'Mặc định', value: 'default' },
  { label: '16:9', value: '16/9' },
  { label: '4:3', value: '4/3' },
  { label: '21:9', value: '21/9' },
  { label: '1:1', value: '1/1' },
  { label: 'Lấp đầy', value: 'fill' },
];
const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

const SettingsTooltip = memo(({ 
  isOpen, 
  onClose, 
  playbackRate, 
  onPlaybackRateChange,
  aspectRatio,
  onAspectRatioChange,
  position,
  servers,
  selectedServerIndex,
  onServerChange
}: SettingsTooltipProps) => {
  const [activeTab, setActiveTab] = useState<'speed' | 'ratio' | 'server'>(servers ? 'server' : 'speed');
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={tooltipRef}
      className={st.settingsTooltip}
      style={{
        bottom: `${position.y}px`,
        right: `${position.x}px`,
      }}
    >
      <div className={st.settingsHeader}>
        {servers && (
          <button
            className={clsx(st.settingsTab, activeTab === 'server' && st.active)}
            onClick={() => setActiveTab('server')}
          >
            Server
          </button>
        )}
        <button
          className={clsx(st.settingsTab, activeTab === 'speed' && st.active)}
          onClick={() => setActiveTab('speed')}
        >
          Tốc độ
        </button>
        <button
          className={clsx(st.settingsTab, activeTab === 'ratio' && st.active)}
          onClick={() => setActiveTab('ratio')}
        >
          Tỷ lệ
        </button>
      </div>

      <div className={st.settingsContent}>
        {activeTab === 'server' && servers && (
          <div className={st.settingsSection}>
            {servers.map((server, idx) => (
              <button
                key={idx}
                className={clsx(
                  st.settingsOption,
                  selectedServerIndex === idx && st.active
                )}
                onClick={() => {
                  onServerChange?.(idx);
                  onClose();
                }}
              >
                <span>{server.server_name}</span>
                {selectedServerIndex === idx && <Check size={16} />}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'speed' && (
          <div className={st.settingsSection}>
            {PLAYBACK_RATES.map((rate) => (
              <button
                key={rate}
                className={clsx(
                  st.settingsOption,
                  playbackRate === rate && st.active
                )}
                onClick={() => {
                  onPlaybackRateChange(rate);
                  onClose();
                }}
              >
                <span>{rate === 1 ? 'Bình thường' : `${rate}x`}</span>
                {playbackRate === rate && <Check size={16} />}
              </button>
            ))}
          </div>
        )}

        {activeTab === 'ratio' && (
          <div className={st.settingsSection}>
            {ASPECT_RATIOS.map((ratio) => (
              <button
                key={ratio.value}
                className={clsx(
                  st.settingsOption,
                  aspectRatio === ratio.value && st.active
                )}
                onClick={() => {
                  onAspectRatioChange(ratio.value);
                  onClose();
                }}
              >
                <span>{ratio.label}</span>
                {aspectRatio === ratio.value && <Check size={16} />}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

export default SettingsTooltip;