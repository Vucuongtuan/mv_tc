"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Movie } from '@/types/type';
import Image from '@/components/Commons/Image';
import Link from 'next/link';
import { Play, Plus, ThumbsUp } from 'lucide-react';

interface MovieHoverModalProps {
  movie: Movie;
  position: { top: number; left: number; width: number; height: number };
  onClose: () => void;
}

const MovieHoverModal: React.FC<MovieHoverModalProps> = ({ movie, position, onClose }) => {
  const scale = 1.4;
  const expandedWidth = position.width * scale;
  
  // Center calculation
  let top = position.top - (position.height * (scale - 1)) / 2;
  let left = position.left - (expandedWidth - position.width) / 2;

  // Boundary safety
  const padding = 16;
  if (left < padding) left = padding;
  if (left + expandedWidth > window.innerWidth - padding) {
    left = window.innerWidth - expandedWidth - padding;
  }
  if (top < 80) top = position.top;

  const matchScore = 90 + (movie.name.length % 10);

  return (
    <div className="fixed inset-0 z-10 pointer-events-none" style={{ overflow: 'hidden' }}>
      <motion.div
        initial={{ 
          opacity: 0,
          top: position.top, 
          left: position.left, 
          width: position.width, 
          height: position.height,
          borderRadius: "0.5rem"
        }}
        animate={{ 
          opacity: 1,
          top: top, 
          left: left, 
          width: expandedWidth,
          height: "auto",
          borderRadius: "0.75rem",
          transition: { 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            mass: 0.8
          }
        }}
        exit={{ 
          opacity: 0, 
          scale: 0.95,
          transition: { duration: 0.15 } 
        }}
        className="absolute bg-[#181818] shadow-[0_16px_48px_rgba(0,0,0,0.7)] overflow-hidden pointer-events-auto ring-1 ring-white/10"
        onMouseLeave={onClose}
      >
        {/* Image Area */}
        <div className="relative aspect-video w-full bg-black overflow-hidden">
          <Image 
            src={movie.poster_url || movie.thumb_url} 
            alt={movie.name}
            width={400}
            height={225}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
          
          <div className="absolute bottom-3 left-3 right-3 z-10">
            <h3 className="text-base font-bold text-white drop-shadow-lg leading-tight line-clamp-1">
              {movie.name}
            </h3>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 8 }}
          animate={{ 
            opacity: 1, 
            y: 0,
            transition: { delay: 0.1, duration: 0.25 } 
          }}
          className="p-3 bg-[#181818]"
        >
          {/* Controls */}
          <div className="flex items-center gap-2 mb-3">
            <Link 
              href={`/phim/${movie.slug}`}
              className="flex-1 bg-white hover:bg-gray-200 text-black text-xs font-bold py-1.5 rounded flex items-center justify-center gap-1.5 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Phát
            </Link>
            <button className="w-8 h-8 rounded-full border border-gray-500 hover:border-white flex items-center justify-center bg-[#2a2a2a]/50 transition-colors">
              <Plus className="w-4 h-4 text-white" />
            </button>
            <button className="w-8 h-8 rounded-full border border-gray-500 hover:border-white flex items-center justify-center bg-[#2a2a2a]/50 transition-colors">
              <ThumbsUp className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Meta */}
          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 text-[11px] font-medium text-gray-300 mb-2">
            <span className="text-green-400 font-bold">{matchScore}% Phù hợp</span>
            <span className="border border-gray-500/80 px-1 py-0.5 rounded text-[10px]">16+</span>
            <span>{movie.year}</span>
            {movie.time && <span className="text-white/60">{movie.time}</span>}
            <span className="border border-gray-500/80 px-1 py-0.5 rounded text-[9px] uppercase">HD</span>
          </div>

          {/* Genres */}
          <div className="flex flex-wrap items-center gap-1 text-[11px] text-white/80">
            {movie.category?.slice(0, 3).map((cat, idx) => (
              <React.Fragment key={cat.slug}>
                {idx > 0 && <span className="text-gray-500 text-[8px]">•</span>}
                <span>{cat.name}</span>
              </React.Fragment>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MovieHoverModal;
