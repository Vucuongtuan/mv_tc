
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://old-mountain-1061.vucuongtuansin1.workers.dev/';
const CDN_KEY = process.env.NEXT_PUBLIC_CDN_KEY || 'tc4im';

interface CloudflareLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudflareLoader({ src, width, quality }: CloudflareLoaderProps) {
  return `${CLOUDFLARE_WORKER_URL}?url=${encodeURIComponent(
    src
  )}&w=${width}&q=${quality || 75}&k=${CDN_KEY}&format=auto`;
}
