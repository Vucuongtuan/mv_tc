
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import st from './watch-page.module.scss';

export default function WatchHeader({ title, backUrl }: { title: string; backUrl: string }) {
  return (
    <header className={st.header}>
      <Link href={backUrl} className={st.backBtn}>
        <ChevronLeft size={24} />
      </Link>
      <h1>{title}</h1>
    </header>
  );
}
