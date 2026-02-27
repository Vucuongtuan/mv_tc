'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Movie } from '@/types/type';
import styles from './ai-chat.module.scss';
import { Send } from 'lucide-react';
import MovieResultItem from '@/components/Commons/MovieResultItem';

interface MovieResult {
  movie: Movie;
  keyword: string;
  cdnImage: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  text: string;
  movies?: MovieResult[];
  cdnImage?: string;
  isLoading?: boolean;
}

const QUICK_PROMPTS = [
  '🎬 Phim kinh dị hay nhất 2024-2025',
  '🇰🇷 Phim Hàn Quốc lãng mạn',
  '🦸 Phim siêu anh hùng Marvel mới nhất',
  '🎭 Phim tâm lý twist kết bất ngờ',
  '🔥 Anime hành động hot nhất',
];

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

  const handleSubmit = useCallback(async (prompt?: string) => {
    const text = prompt || input.trim();
    if (!text || isLoading) return;

    setInput('');
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = { role: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    // Add loading AI message
    const aiMsgIndex = messages.length + 1;
    setMessages(prev => [...prev, { role: 'ai', text: '', isLoading: true }]);

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
        } catch { /* ignore */ }
        throw new Error(errorMsg);
      }

      const data = await response.json();

      setMessages(prev => {
        const updated = [...prev];
        updated[aiMsgIndex] = {
          role: 'ai',
          text: data.message || '',
          movies: data.movies || [],
          cdnImage: data.cdnImage || '',
          isLoading: false,
        };
        return updated;
      });

    } catch (error: any) {
      setMessages(prev => {
        const updated = [...prev];
        updated[aiMsgIndex] = {
          role: 'ai',
          text: `❌ ${error.message || 'Có lỗi xảy ra. Vui lòng thử lại.'}`,
          isLoading: false,
        };
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, messages.length]);

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

            {/* Loading state */}
            {msg.isLoading && (
              <div className={styles.aiLoading}>
                <span className={styles.dot} />
                <span className={styles.dot} />
                <span className={styles.dot} />
              </div>
            )}

            {/* Message text */}
            {!msg.isLoading && msg.text && (
              <div className={styles.messageText}>{msg.text}</div>
            )}

            {/* Movie results from database */}
            {msg.movies && msg.movies.length > 0 && (
              <div className={styles.suggestionsWrapper}>
                {msg.movies.map((result, j) => (
                  <MovieResultItem
                    key={`${result.movie.slug}-${j}`}
                    movie={result.movie}
                    cdnImage={`${result.cdnImage}/uploads/movies`}
                    subtitle={`${result.movie.origin_name || ''}${result.movie.year ? ` (${result.movie.year})` : ''}`}
                    className={styles.suggestionCard}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

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
