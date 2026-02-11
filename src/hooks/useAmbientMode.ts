"use client"
import { useEffect, useRef } from 'react';

export const useAmbientMode = (
  videoRef: React.RefObject<HTMLVideoElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  isEnabled: boolean
) => {
  useEffect(() => {
    if (!isEnabled || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { 
      alpha: false, 
      desynchronized: true 
    });
    
    if (!ctx) return;

    let animationFrameId: number;
    let count = 0;

    const loop = () => {
      if (video.paused || video.ended) {
        animationFrameId = requestAnimationFrame(loop);
        return;
      }

      if (count % 2 === 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      
      count++;
      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height); 
    };
  }, [isEnabled, videoRef, canvasRef]);
};