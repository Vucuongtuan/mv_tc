"use client"

import { EpisodeData, EpisodeServer } from '@/types/type';
import st from './episode.module.scss';
import Link from 'next/link';
import { useState, useMemo } from 'react';
import { clsx } from 'clsx';
import { useParams } from 'next/navigation';

const getServerCategory = (serverName: string) => {
    const name = serverName.toLowerCase();
    if (name.includes('thuyết minh') || name.includes('thuyet minh')) return 'thuyet-minh';
    return 'vietsub';
}

interface EpisodesProps {
    episodes: EpisodeServer[];
    episodes2?: EpisodeServer[];
    slug: string;
}

export default function Episodes({ episodes = [], episodes2 = [], slug }: EpisodesProps) {
    const params = useParams();
    const watchParams = params?.params as string[] || [];
    const currentEpisodeSlug = watchParams.length > 0 ? watchParams[watchParams.length - 1] : '';

    const groups = useMemo(() => {
        const allServers = [...episodes, ...episodes2];
        const result: { [key: string]: { name: string, servers: EpisodeServer[] } } = {};
        
        allServers.forEach(server => {
            if (!server || !server.server_data) return;
            
            const cat = getServerCategory(server.server_name);
            if (!result[cat]) {
                result[cat] = {
                    name: cat === 'thuyet-minh' ? 'Thuyết minh' : 'Vietsub',
                    servers: []
                };
            }
            result[cat].servers.push(server);
        });
        return result;
    }, [episodes, episodes2]);

    const categories = Object.keys(groups);
    const [activeTab, setActiveTab] = useState(categories[0] || 'vietsub');

    const currentEpisodeGrid = useMemo(() => {
        const group = groups[activeTab];
        if (!group) return [];
        
        const uniqueEpisodes = new Map<string, EpisodeData>();
        
        group.servers.forEach(server => {
            server.server_data.forEach(ep => {
                if (!uniqueEpisodes.has(ep.slug)) {
                    uniqueEpisodes.set(ep.slug, ep);
                }
            });
        });
        
        return Array.from(uniqueEpisodes.values()).sort((a, b) => {
            const numA = parseInt(a.name);
            const numB = parseInt(b.name);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.name.localeCompare(b.name, undefined, { numeric: true });
        });
    }, [groups, activeTab]);

    if (categories.length === 0) return null;

    return (
        <section className={st.section} aria-labelledby="episodes-heading">
            <h3 id="episodes-heading">Danh sách tập</h3>
            
            {/* Tabs Header */}
            <div className={st.tabsHeader}>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        className={clsx(st.tabBtn, activeTab === cat && st.active)}
                        onClick={() => setActiveTab(cat)}
                    >
                        {groups[cat].name}
                    </button>
                ))}
            </div>

            {/* Episode Grid */}
            <div className={st.serverList}>
                <ul className={st.episodeGrid}>
                    {currentEpisodeGrid.map((ep: EpisodeData, idx: number) => {
                        const href = activeTab === 'vietsub' 
                            ? `/phim/${slug}/${ep.slug}`
                            : `/phim/${slug}/${activeTab}/${ep.slug}`;
                        
                        const isActive = currentEpisodeSlug === ep.slug;

                        return (
                            <li key={idx}>
                                <Link 
                                    href={href}
                                    className={clsx(st.episodeBtn, isActive && st.active)}
                                >
                                    {ep.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </section>
    );
}
