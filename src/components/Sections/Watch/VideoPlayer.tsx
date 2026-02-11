'use client';

import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Settings, PictureInPicture, 
  Cast, SkipBack, SkipForward, Maximize, Minimize, 
  Check, Server,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import st from './video-player.module.scss';
import Placeholder from './Plaholder';

interface VideoPlayerProps {
  src: string;
  embedUrl?: string;
  poster?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number) => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  initialTime?: number;
  servers?: any[];
  selectedServerIndex?: number;
  onServerChange?: (index: number) => void;
}

// Settings Tooltip Component
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

SettingsTooltip.displayName = 'SettingsTooltip';

// Tối ưu: Tách các icon thành component memo
const PlayIcon = memo(() => <Play size={28} fill="currentColor" />);
const PauseIcon = memo(() => <Pause size={28} fill="currentColor" />);
const CenterPlayIcon = memo(() => <Play size={64} fill="currentColor" />);

PlayIcon.displayName = 'PlayIcon';
PauseIcon.displayName = 'PauseIcon';
CenterPlayIcon.displayName = 'CenterPlayIcon';

// Constants
const PLAYBACK_RATES = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const ASPECT_RATIOS = [
  { label: 'Mặc định', value: 'default' },
  { label: '16:9', value: '16/9' },
  { label: '4:3', value: '4/3' },
  { label: '21:9', value: '21/9' },
  { label: '1:1', value: '1/1' },
  { label: 'Lấp đầy', value: 'fill' },
];

// Utility functions
function useThrottle<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const lastRan = useRef(Date.now());

  return useCallback(
    ((...args) => {
      const now = Date.now();
      if (now - lastRan.current >= delay) {
        callback(...args);
        lastRan.current = now;
      }
    }) as T,
    [callback, delay]
  );
}

function useDebounce<T extends (...args: any[]) => void>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  return useCallback(
    ((...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

function useRafState<T>(initialValue: T): [T, (value: T) => void] {
  const [state, setState] = useState(initialValue);
  const rafRef = useRef<number>(0);

  const setRafState = useCallback((value: T) => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }
    rafRef.current = requestAnimationFrame(() => {
      setState(value);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return [state, setRafState];
}

export default function VideoPlayer({ 
  src, 
  embedUrl,
  poster, 
  title,
  onTimeUpdate,
  onEnded,
  autoPlay = false,
  initialTime = 0,
  servers,
  selectedServerIndex,
  onServerChange
}: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [volume, setVolume] = useState(1);
  const [previousVolume, setPreviousVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useRafState(initialTime);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useRafState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Settings states
  const [showSettings, setShowSettings] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [aspectRatio, setAspectRatio] = useState('default');
  const [settingsPosition, setSettingsPosition] = useState({ x: 0, y: 0 });
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  const lastTimeUpdateRef = useRef(0);

  const [useEmbed, setUseEmbed] = useState(() => !src || src.trim() === '' && !!embedUrl);

  useEffect(() => {
    if (!src || src.trim() === '') {
      if (embedUrl) setUseEmbed(true);
    } else {
      setUseEmbed(false);
    }
    setIsLoading(true);
    setIsPlaying(autoPlay);
  }, [src, embedUrl, autoPlay]);

  const handleVideoError = useCallback(() => {
    console.warn("Video play error, falling back to embed...");
    if (embedUrl) {
      setUseEmbed(true);
      setIsLoading(true); 
    }
  }, [embedUrl]);

  const formatTime = useCallback((time: number): string => {
    if (isNaN(time)) return '0:00';
    
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = Math.floor(time % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const formattedCurrentTime = useMemo(() => formatTime(currentTime), [currentTime, formatTime]);
  const formattedDuration = useMemo(() => formatTime(duration), [duration, formatTime]);

  const videoObjectFit = useMemo(() => {
    if (aspectRatio === 'fill') return 'fill';
    if (aspectRatio === 'default') return 'contain';
    return 'contain';
  }, [aspectRatio]);

  const containerAspectRatio = useMemo(() => {
    if (aspectRatio === 'default' || aspectRatio === 'fill') return undefined;
    return aspectRatio;
  }, [aspectRatio]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || useEmbed) {
        if(useEmbed) setIsLoading(false);
        return;
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      if (initialTime > 0) {
        video.currentTime = initialTime;
      }
      if (autoPlay) {
        video.play().catch(() => setIsPlaying(false));
      }
    };

    video.addEventListener('canplay', handleCanPlay);
    return () => video.removeEventListener('canplay', handleCanPlay);
  }, [autoPlay, initialTime, useEmbed, src]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleTimeUpdate = useThrottle(useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    const current = video.currentTime;
    
    if (Math.abs(current - lastTimeUpdateRef.current) > 0.1) {
      setCurrentTime(current);
      lastTimeUpdateRef.current = current;
      onTimeUpdate?.(current);
    }

    if (video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      const bufferedPercent = (bufferedEnd / video.duration) * 100;
      setBuffered(bufferedPercent);
    }
  }, [onTimeUpdate, setCurrentTime, setBuffered]), 16);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  }, []);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const hideControlsDebounced = useDebounce(useCallback(() => {
    if (isPlaying && !showSettings) {
      setShowControls(false);
    }
  }, [isPlaying, showSettings]), 3000);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    hideControlsDebounced();
  }, [hideControlsDebounced]);

  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    requestAnimationFrame(() => {
      if (isPlaying) {
        video.pause();
      } else {
        video.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    });
  }, [isPlaying]);

  const skip = useCallback((amount: number) => {
    const video = videoRef.current;
    if (!video) return;
    
    requestAnimationFrame(() => {
      const newTime = Math.max(0, Math.min(video.currentTime + amount, duration));
      video.currentTime = newTime;
    });
  }, [duration]);

  const handleVolumeChange = useThrottle(useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    const video = videoRef.current;
    if (!video) return;

    requestAnimationFrame(() => {
      setVolume(newVolume);
      setIsMuted(newVolume === 0);
      video.volume = newVolume;
      video.muted = newVolume === 0;
    });
  }, []), 16);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    requestAnimationFrame(() => {
      if (isMuted) {
        const volumeToRestore = previousVolume || 0.5;
        setVolume(volumeToRestore);
        video.volume = volumeToRestore;
        video.muted = false;
        setIsMuted(false);
      } else {
        setPreviousVolume(volume);
        setVolume(0);
        video.volume = 0;
        video.muted = true;
        setIsMuted(true);
      }
    });
  }, [isMuted, volume, previousVolume]);

  const handleProgressClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    
    requestAnimationFrame(() => {
      video.currentTime = percent * duration;
    });
  }, [duration]);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!document.fullscreenElement) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  }, []);

  const handlePictureInPicture = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('PiP error:', error);
    }
  }, []);

  const handleSettingsClick = useCallback(() => {
    if (!settingsButtonRef.current) return;

    const rect = settingsButtonRef.current.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      setSettingsPosition({
        x: containerRect.right - rect.right + 10,
        y: containerRect.bottom - rect.top + 10,
      });
    }

    setShowSettings(!showSettings);
  }, [showSettings]);

  const handlePlaybackRateChange = useCallback((rate: number) => {
    setPlaybackRate(rate);
  }, []);

  const handleAspectRatioChange = useCallback((ratio: string) => {
    setAspectRatio(ratio);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;

      const shouldPreventDefault = [' ', 'k', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key);
      if (shouldPreventDefault) {
        e.preventDefault();
      }

      switch (e.key) {
        case ' ':
        case 'k':
          togglePlay();
          break;
        case 'ArrowLeft':
          skip(-10);
          break;
        case 'ArrowRight':
          skip(10);
          break;
        case 'ArrowUp':
          if (videoRef.current) {
            const newVolume = Math.min(1, volume + 0.1);
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
          }
          break;
        case 'ArrowDown':
          if (videoRef.current) {
            const newVolume = Math.max(0, volume - 0.1);
            videoRef.current.volume = newVolume;
            setVolume(newVolume);
          }
          break;
        case 'm':
          toggleMute();
          break;
        case 'f':
          toggleFullscreen();
          break;
        case 's':
          handleSettingsClick();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [togglePlay, skip, toggleMute, toggleFullscreen, volume, handleSettingsClick]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const progressWidth = useMemo(() => {
    return duration > 0 ? `${(currentTime / duration) * 100}%` : '0%';
  }, [currentTime, duration]);

  return (
    <div 
      ref={containerRef}
      className={clsx(st.videoWrapper, "group")}
      style={{ aspectRatio: containerAspectRatio }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && !showSettings && setShowControls(false)}
    >
      {isLoading && (
        <div className={st.loadingState}>
          <div className="absolute inset-0 ">
            <Placeholder/>
          </div>
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center">
            <p className={st.loadingText}>Bạn đang xem phim tại: TC Phim</p>
            <p className={st.subText}>Chúc bạn xem phim vui vẻ!</p>
            <div className="flex items-center gap-2">
              <Loader2 className="animate-spin" />
              <p>Đang tải phim...</p>
            </div>
          </div>
        </div>
      )}
      
      {useEmbed ? (
        <iframe
          src={embedUrl}
          className="w-full h-full border-0 absolute inset-0 z-10"
          allowFullScreen
          onLoad={() => setIsLoading(false)}
        />
      ) : (
        <video
          ref={videoRef}
          className={st.video}
          style={{ objectFit: videoObjectFit }}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onWaiting={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
          onError={handleVideoError} // Thêm xử lý lỗi
          src={src}
          poster={poster}
          preload="metadata"
          playsInline
        />
      )}

      {!useEmbed && !isPlaying && !isLoading && (
        <button 
          className={st.centerPlayBtn}
          onClick={togglePlay}
          aria-label="Play"
        >
          <CenterPlayIcon />
        </button>
      )}

      {/* Chỉ hiện Controls Overlay khi KHÔNG PHẢI là Embed (để iframe nhận click) */}
      {!useEmbed && (
      <div 
        className={clsx(
          st.controlsOverlay, 
          (showControls || showSettings || !isPlaying) && st.visible
        )}
      >
        <div className={st.gradientOverlay} />

        <div 
          className={clsx(st.progressBar, "group/progress")} 
          onClick={handleProgressClick}
        >
          <div className={st.bufferFill} style={{ width: `${buffered}%` }} />
          <div 
            className={st.progressFill} 
            style={{ width: progressWidth }} 
          />
        </div>

        <div className={st.controlBar}>
          <div className={st.leftControls}>
              <>
                <button 
                  onClick={togglePlay} 
                  className={st.controlBtn}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <PauseIcon /> : <PlayIcon />}
                </button>

                <button 
                  onClick={() => skip(-10)}
                  className={st.controlBtn}
                  aria-label="Skip backward 10 seconds"
                >
                  <SkipBack size={20} />
                </button>

                <button 
                  onClick={() => skip(10)}
                  className={st.controlBtn}
                  aria-label="Skip forward 10 seconds"
                >
                  <SkipForward size={20} />
                </button>
                
                <div className={clsx(st.volumeControl, "group/vol")}>
                  <button 
                    onClick={toggleMute}
                    className={st.controlBtn}
                    aria-label={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX size={20} />
                    ) : (
                      <Volume2 size={20} />
                    )}
                  </button>
                  <div className={st.volSliderWrapper}>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.01" 
                      value={volume} 
                      onChange={handleVolumeChange}
                      className={st.volSlider}
                      aria-label="Volume"
                    />
                  </div>
                </div>

                <span className={st.timeDisplay}>
                  {formattedCurrentTime} / {formattedDuration}
                </span>

                {playbackRate !== 1 && (
                  <span className={st.playbackIndicator}>{playbackRate}x</span>
                )}
              </>
          </div>

          <div className={st.rightControls}>
            <button 
              ref={settingsButtonRef}
              onClick={handleSettingsClick}
              className={clsx(st.controlBtn, showSettings && st.active)}
              aria-label="Settings"
            >
              <Settings size={20} />
            </button>

            <button 
              onClick={handlePictureInPicture}
              className={st.controlBtn}
              aria-label="Picture in Picture"
            >
              <PictureInPicture size={20} />
            </button>

            <button 
              className={st.controlBtn}
              aria-label="Cast"
            >
              <Cast size={20} />
            </button>

            <button 
              onClick={toggleFullscreen}
              className={st.controlBtn}
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize size={20} />
              ) : (
                <Maximize size={20} />
              )}
            </button>
          </div>
        </div>

        <SettingsTooltip
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRateChange}
          aspectRatio={aspectRatio}
          onAspectRatioChange={handleAspectRatioChange}
          position={settingsPosition}
          servers={servers}
          selectedServerIndex={selectedServerIndex}
          onServerChange={onServerChange}
        />
      </div>
      )}
    </div>
  );
}
