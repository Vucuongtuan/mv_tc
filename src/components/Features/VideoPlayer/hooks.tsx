"use client"

import { useAmbientMode } from "@/hooks/useAmbientMode";
import { useDebounce } from "@uidotdev/usehooks";
import { Pause, Play } from "lucide-react";
import { usePathname } from "next/navigation";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

export interface VideoPlayerProps {
  src: string;
  embedUrl?: string;
  poster?: string;
  title?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  autoPlay?: boolean;
  initialTime?: number;
  servers?: any[];
  selectedServerIndex?: number;
  onServerChange?: (index: number) => void;
  isAmbientMode?: boolean;
  onToggleAmbientMode?: () => void;
  isInitialLoad?: boolean;
  onReady?: () => void;
}

function usePlayerControls({
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
  onServerChange,
  isAmbientMode: isAmbientModeProp,
  onToggleAmbientMode,
  isInitialLoad: isInitialLoadProp = true,
  onReady
}:VideoPlayerProps) {
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
  const pathname = usePathname();
 const [useEmbed, setUseEmbed] = useState(() => !src || src.trim() === '' && !!embedUrl);
  
  const [isAmbientModeInternal, setIsAmbientModeInternal] = useState(() => {
    if (typeof window !== 'undefined') {
        return localStorage.getItem('ambient-mode') === 'true';
    }
    return false;
  });

  const isAmbientMode = isAmbientModeProp !== undefined ? isAmbientModeProp : isAmbientModeInternal;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // @ts-expect-error
  useAmbientMode(videoRef, canvasRef, isAmbientMode);

  const toggleAmbientMode = useCallback(() => {
    if (onToggleAmbientMode) {
        onToggleAmbientMode();
    } else {
        setIsAmbientModeInternal((prev:any) => {
            const next = !prev;
            localStorage.setItem('ambient-mode', String(next));
            return next;
        });
    }
  }, [onToggleAmbientMode]);

  // Pause video on route change to prevent audio leak during transitions
  useEffect(() => {
    const video = videoRef.current;
    if (video && isPlaying) {
      video.pause();
      setIsPlaying(false);
    }
  }, [pathname]);

  useEffect(() => {
    const video = videoRef.current;
    return () => {
      if (video) {
        video.pause();
        video.src = "";
        try {
          video.load();
        } catch (e) {
          // silently handle cleanup errors
        }
      }
    };
  }, []);

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
        if(useEmbed) {
            setIsLoading(false);
            onReady?.();
        }
        return;
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      onReady?.();
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
      onTimeUpdate?.(current, video.duration || 0);
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

  const controlsTimerRef = useRef<NodeJS.Timeout>(null);

  const handleMouseMove = useCallback(() => {
    setShowControls(true);
    
    if (controlsTimerRef.current) {
      clearTimeout(controlsTimerRef.current);
    }

    if (isPlaying && !showSettings) {
      controlsTimerRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying, showSettings]);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) {
        clearTimeout(controlsTimerRef.current);
      }
    };
  }, []);

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


  return {
    videoRef,
    containerRef,
    settingsButtonRef,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    isPlaying,
    setIsPlaying,
    showControls,
    setShowControls,
    showSettings,
    setShowSettings,
    buffered,
    progressWidth,
    formattedCurrentTime,
    formattedDuration,
    videoObjectFit,
    containerAspectRatio,
    settingsPosition,
    useEmbed,
    canvasRef,
    isAmbientMode,
    togglePlay,
    skip,
    handleVolumeChange,
    toggleMute,
    handleProgressClick,
    toggleFullscreen,
    handlePictureInPicture,
    handleSettingsClick,
    handlePlaybackRateChange,
    handleAspectRatioChange,
    handleVideoError,
    toggleAmbientMode,
    handleMouseMove,
    isLoading,
    setIsLoading,
    isInitialLoad: isInitialLoadProp,
    isFullscreen,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded
  }
}



function useThrottle<T extends (...args:any[]) => void>(callback: T, delay: number):T {
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


const PlayIcon = memo(() => <Play size={28} fill="currentColor" />);
const PauseIcon = memo(() => <Pause size={28} fill="currentColor" />);
const CenterPlayIcon = memo(() => <Play size={64} fill="currentColor" />);

PlayIcon.displayName = 'PlayIcon';
PauseIcon.displayName = 'PauseIcon';
CenterPlayIcon.displayName = 'CenterPlayIcon';



export {
    PlayIcon,
    PauseIcon,
    CenterPlayIcon,
    useThrottle,
    useRafState,
    usePlayerControls
}