
export const getIdEmbedYoutube = (url: string): string  => {
  const youtubeRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/|shorts\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  const match = url.match(youtubeRegex);
  return match ? match[1] : 'dQw4w9WgXcQ';
};