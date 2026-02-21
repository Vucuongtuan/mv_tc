"use client"

import { clsx } from "clsx";
import { VideoPlayerProps, usePlayerControls } from "./hooks";
import st from "./video-player.module.scss";
import LoadingScreen from "./LoadingScreen";
import Embed from "./Embed";
import VideoHls from "./VideoHls";

export default function VideoPlayer(props: VideoPlayerProps) {
    const controls = usePlayerControls(props);
    const {
        containerRef,
        containerAspectRatio,
        handleMouseMove,
        isPlaying,
        showSettings,
        setShowControls,
        useEmbed,
        isAmbientMode,
        canvasRef,
        isLoading,
        setIsLoading,
        isInitialLoad
    } = controls;

    return (
        <div
            ref={containerRef}
            className={clsx(st.videoWrapper, "group")}
            style={{ aspectRatio: containerAspectRatio }}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && !showSettings && setShowControls(false)}
        >
            {!useEmbed && isAmbientMode && (
                <div className={st.ambientContainer}>
                    <canvas
                        ref={canvasRef}
                        width={100}
                        height={56}
                        className={st.ambientCanvas}
                    />
                </div>
            )}

            <div className={st.mainPlayerContent}>
                {isLoading && <LoadingScreen minimal={!isInitialLoad} />}

                {useEmbed ? (
                    <Embed 
                        src={props.embedUrl || ""} 
                        fn={() => setIsLoading(false)} 
                    />
                ) : (
                    <VideoHls 
                        controls={controls} 
                        {...props} 
                    />
                )}
            </div>
        </div>
    );
}
