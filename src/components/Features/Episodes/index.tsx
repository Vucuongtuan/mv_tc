import { EpisodeData, EpisodeServer } from '@/types/type';
import st from './episode.module.scss';
import Link from 'next/link';

export default function Episodes({episodes,slug}: {episodes: any,slug: string}) {
    return (
               <section className={st.section} aria-labelledby="episodes-heading">
                            <h3 id="episodes-heading">Danh sách tập</h3>
                            <ul className={st.serverList}>
                                {episodes.map((server: EpisodeServer, index: number) => (
                                    <li key={index} className={st.serverGroup}>
                                        <h4 className={st.serverName}>{server.server_name}</h4>
                                        <ul className={st.episodeGrid}>
                                            {server.server_data.map((ep: EpisodeData, idx: number) => (
                                                <li key={idx}>
                                                    <Link 
                                                        href={`/phim/${slug}/${ep.slug}`}
                                                        className={st.episodeBtn}
                                                    >
                                                        {ep.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                ))}
                            </ul>
                        </section>
    );
}