import { describe, it, expect } from 'vitest';
import { getIdEmbedYoutube } from './embed';

describe('getIdEmbedYoutube', () => {
  const DEFAULT_ID = 'dQw4w9WgXcQ';

  it('extracts ID from standard YouTube URL', () => {
    expect(getIdEmbedYoutube('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getIdEmbedYoutube('http://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getIdEmbedYoutube('www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from short youtu.be URL', () => {
    expect(getIdEmbedYoutube('https://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
    expect(getIdEmbedYoutube('http://youtu.be/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from embed URL', () => {
    expect(getIdEmbedYoutube('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from shorts URL', () => {
    expect(getIdEmbedYoutube('https://www.youtube.com/shorts/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID from URL with additional parameters', () => {
    expect(getIdEmbedYoutube('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1s')).toBe('dQw4w9WgXcQ');
    expect(getIdEmbedYoutube('https://youtu.be/dQw4w9WgXcQ?t=1s')).toBe('dQw4w9WgXcQ');
  });

  it('extracts ID when v is not the first parameter', () => {
    expect(getIdEmbedYoutube('https://www.youtube.com/watch?feature=youtu.be&v=dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

  it('returns default ID for invalid URLs', () => {
    expect(getIdEmbedYoutube('https://www.google.com')).toBe(DEFAULT_ID);
    expect(getIdEmbedYoutube('invalid-url')).toBe(DEFAULT_ID);
    expect(getIdEmbedYoutube('')).toBe(DEFAULT_ID);
  });

  // Test case for "vi" which is in the regex
  it('extracts ID from vi/ URL', () => {
     expect(getIdEmbedYoutube('https://www.youtube.com/vi/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

   // Test case for "v/" which is in the regex
  it('extracts ID from v/ URL', () => {
     expect(getIdEmbedYoutube('https://www.youtube.com/v/dQw4w9WgXcQ')).toBe('dQw4w9WgXcQ');
  });

});
