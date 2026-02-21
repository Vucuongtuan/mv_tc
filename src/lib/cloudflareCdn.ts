
const CLOUDFLARE_WORKER_URL = process.env.CLOUDFLARE_WORKER_URL || 'https://old-mountain-1061.vucuongtuansin1.workers.dev/';

interface CloudflareLoaderProps {
  src: string;
  width: number;
  quality?: number;
}
const randomKey = () =>
  Math.random().toString(36).substring(2, 7)

export default function cloudflareLoader({ src, width, quality }: CloudflareLoaderProps) {
  const key = randomKey()
  
  return `${CLOUDFLARE_WORKER_URL}?url=${encodeURIComponent(
    src
  )}&w=${width}&q=${quality || 75}&k=${key}`
}