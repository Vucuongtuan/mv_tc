'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { searchMovies } from '@/services/actions';
import { Movie } from '@/types/type';
import Link from 'next/link';
import Image from 'next/image';
import styles from './ai-chat.module.scss';
import { Send } from 'lucide-react';

interface MovieSuggestion {
  name: string;
  reason: string;
  movie?: Movie | null;
  cdnImage?: string;
  searching?: boolean;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  suggestions?: MovieSuggestion[];
  isStreaming?: boolean;
}

const QUICK_PROMPTS = [
  '🎬 Phim kinh dị hay nhất 2024-2025',
  '🇰🇷 Phim Hàn Quốc lãng mạn',
  '🦸 Phim siêu anh hùng Marvel mới nhất',
  '🎭 Phim tâm lý twist kết bất ngờ',
  '🔥 Anime hành động hot nhất',
];

function parseMoviesFromText(text: string): { name: string; reason: string }[] {
  const regex = /\[MOVIE\](.*?)\[\/MOVIE\]/g;
  const results: { name: string; reason: string }[] = [];
  let match;
  while ((match = regex.exec(text)) !== null) {
    const parts = match[1].split('|');
    if (parts.length >= 2) {
      results.push({ name: parts[0].trim(), reason: parts[1].trim() });
    } else {
      results.push({ name: parts[0].trim(), reason: '' });
    }
  }
  return results;
}

function cleanTextForDisplay(text: string): string {
  return text.replace(/\[MOVIE\].*?\[\/MOVIE\]/g, '').replace(/\n{3,}/g, '\n\n').trim();
}

export default function AiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const searchMovieInDB = useCallback(async (movieName: string): Promise<{ movie: Movie | null; cdnImage: string }> => {
    try {
      const result = await searchMovies(movieName, 1);
      if (result && result.items.length > 0) {
        return { movie: result.items[0], cdnImage: result.APP_DOMAIN_CDN_IMAGE || '' };
      }
    } catch {
      // ignore search errors
    }
    return { movie: null, cdnImage: '' };
  }, []);

  const handleSubmit = useCallback(async (prompt?: string) => {
    const text = prompt || input.trim();
    if (!text || isLoading) return;

    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    // Add streaming AI message
    const aiMsgIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'ai', text: '', isStreaming: true }]);

    try {
      const response = await fetch('/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: text }),
      });

      if (!response.ok) {
        let errorMsg = 'Có lỗi xảy ra với AI. Vui lòng thử lại.';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {
          // If response isn't JSON, try reading as text
          try {
            const errorText = await response.text();
            // Extract meaningful message from raw Gemini error
            if (errorText.includes('quota') || errorText.includes('429')) {
              errorMsg = '⏳ AI đang bận, vui lòng thử lại sau 1 phút. (Free tier giới hạn số lần gọi)';
            }
          } catch { /* ignore */ }
        }
        throw new Error(errorMsg);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullText += chunk;

          setMessages(prev => {
            const updated = [...prev];
            updated[aiMsgIndex] = {
              role: 'ai',
              text: fullText,
              isStreaming: true,
            };
            return updated;
          });
        }
      }

      // Parse movies from complete response and search DB
      const movieParsed = parseMoviesFromText(fullText);
      const suggestions: MovieSuggestion[] = movieParsed.map(m => ({
        ...m,
        searching: true,
      }));

      // Update message with parsed suggestions (still searching)
      setMessages(prev => {
        const updated = [...prev];
        updated[aiMsgIndex] = {
          role: 'ai',
          text: fullText,
          suggestions,
          isStreaming: false,
        };
        return updated;
      });

      // Search each movie in DB in parallel
      const searchResults = await Promise.all(
        movieParsed.map(m => searchMovieInDB(m.name))
      );

      const finalSuggestions: MovieSuggestion[] = movieParsed.map((m, i) => ({
        ...m,
        movie: searchResults[i].movie,
        cdnImage: searchResults[i].cdnImage,
        searching: false,
      }));

      setMessages(prev => {
        const updated = [...prev];
        updated[aiMsgIndex] = {
          role: 'ai',
          text: fullText,
          suggestions: finalSuggestions,
          isStreaming: false,
        };
        return updated;
      });

    } catch (error: any) {
      setMessages(prev => {
        const updated = [...prev];
        updated[aiMsgIndex] = {
          role: 'ai',
          text: `❌ ${error.message || 'Có lỗi xảy ra. Vui lòng thử lại.'}`,
          isStreaming: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages.length, searchMovieInDB]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  }, [handleSubmit]);

  return (
    <div className={styles.aiContainer}>
      {/* Quick Suggestions (only when no messages) */}
      {messages.length === 0 && (
        <div className={styles.quickSuggestions}>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              className={styles.suggestionChip}
              onClick={() => handleSubmit(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Chat Messages */}
      <div className={styles.chatMessages}>
        {messages.map((msg, i) => (
          <div key={i} className={`${styles.message} ${msg.role === 'user' ? styles.userMessage : styles.aiMessage}`}>
            {msg.role === 'ai' && (
              <div className={styles.aiMessageHeader}>
                <span className={styles.aiIcon}>AI</span>
                <span>TC Phim AI</span>
              </div>
            )}

            {/* Message text (cleaned of [MOVIE] tags) */}
            <div className={styles.messageText}>
              {cleanTextForDisplay(msg.text)}
              {msg.isStreaming && <span className={styles.streamingCursor} />}
            </div>

            {/* Movie suggestions */}
            {msg.suggestions && msg.suggestions.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {msg.suggestions.map((s, j) => (
                  <MovieSuggestionCard key={j} suggestion={s} />
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.text === '' && (
          <div className={`${styles.message} ${styles.aiMessage}`}>
            <div className={styles.aiLoading}>
              <span className={styles.dot} />
              <span className={styles.dot} />
              <span className={styles.dot} />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className={styles.aiInputWrapper}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Mô tả phim bạn muốn xem... (VD: Phim kinh dị Nhật Bản có twist)"
          className={styles.aiInput}
          rows={1}
        />
        <button
          className={styles.aiSendBtn}
          onClick={() => handleSubmit()}
          disabled={isLoading || !input.trim()}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}

function MovieSuggestionCard({ suggestion }: { suggestion: MovieSuggestion }) {
  const { name, reason, movie, cdnImage, searching } = suggestion;

  if (searching) {
    return (
      <div className={styles.movieSuggestion}>
        <div className={styles.suggestionThumb}>
          <div className="w-full h-full bg-white/5 animate-pulse" />
        </div>
        <div className={styles.suggestionInfo}>
          <div className={styles.suggestionName}>{name}</div>
          <div className={styles.suggestionReason}>{reason}</div>
        </div>
      </div>
    );
  }

  if (movie) {
    const thumbUrl = cdnImage
      ? `${cdnImage}/uploads/movies/${movie.thumb_url}`
      : movie.thumb_url;

    return (
      <Link href={`/phim/${movie.slug}`} className={styles.movieSuggestion}>
        <div className={styles.suggestionThumb}>
          <Image
            src={thumbUrl}
            alt={movie.name}
            fill
            sizes="45px"
            className="object-cover"
          />
        </div>
        <div className={styles.suggestionInfo}>
          <div className={styles.suggestionName}>{movie.name}</div>
          <div className={styles.suggestionReason}>{reason}</div>
        </div>
      </Link>
    );
  }

  return (
    <div className={styles.movieSuggestion}>
      <div className={styles.suggestionThumb}>
        <div className="w-full h-full bg-white/5 flex items-center justify-center text-white/20 text-xs">🎬</div>
      </div>
      <div className={styles.suggestionInfo}>
        <div className={styles.suggestionName}>{name}</div>
        <div className={styles.suggestionReason}>{reason}</div>
        <div className={styles.suggestionNotFound}>Chưa có trong cơ sở dữ liệu</div>
      </div>
    </div>
  );
}
