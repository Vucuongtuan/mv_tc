"use client"

import { Maximize, Minimize, PauseIcon, PlayIcon, SkipBack, SkipForward, Volume2, VolumeX, Settings, PictureInPicture } from "lucide-react";
import { CenterPlayIcon, VideoPlayerProps } from "./hooks";
import clsx from "clsx";
import st from "./video-player.module.scss"
import SettingsTooltip from "./SettingsTooltip";

interface VideoHlsProps extends VideoPlayerProps {
    controls: any; // Type này có thể được định nghĩa kỹ hơn từ return của usePlayerControls
}

export default function VideoHls({ controls, ...props }: VideoHlsProps) {
    const {
        videoRef,
        videoObjectFit,
        handleTimeUpdate,
        handleLoadedMetadata,
        handleEnded,
        setIsPlaying,
        setIsLoading,
        handleVideoError,
        togglePlay,
        showControls,
        showSettings,
        setShowSettings,
        isPlaying,
        isLoading,
        buffered,
        progressWidth,
        handleProgressClick,
        toggleMute,
        volume,
        isMuted,
        handleVolumeChange,
        formattedCurrentTime,
        formattedDuration,
        playbackRate,
        handleSettingsClick,
        handlePictureInPicture,
        toggleFullscreen,
        isFullscreen,
        settingsButtonRef,
        skip,
        handlePlaybackRateChange,
        aspectRatio,
        handleAspectRatioChange,
        settingsPosition,
        isAmbientMode,
        toggleAmbientMode
    } = controls;

    const { servers, selectedServerIndex, onServerChange } = props;

    return (
        <>
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
                onError={handleVideoError}
                src={props.src}
                poster={props.poster}
                preload="metadata"
                playsInline
            />

            {!isPlaying && !isLoading && (
                <button
                    className={st.centerPlayBtn}
                    onClick={togglePlay}
                    aria-label="Play"
                >
                    <CenterPlayIcon />
                </button>
            )}

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
                            />            </div>
        </>
    );
}
