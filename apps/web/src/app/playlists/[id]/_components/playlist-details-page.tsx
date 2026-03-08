'use client';

import { useQuery } from '@tanstack/react-query';
import { useMemo, useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@goran/ui-components';
import { ApiService } from '../../../../lib/api/api-service';
import { PlaylistsService } from '../../../../lib/api/playlists-service';
import AppSidebar from '../../../_components/app-sidebar';

const SIDEBAR_STORAGE_KEY = 'dashboard.sidebar.open';

function formatDuration(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes}:${remaining.toString().padStart(2, '0')}`;
}

export function PlaylistDetailsPage({ playlistId }: { playlistId: string }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const apiService = useMemo(() => new ApiService(), []);
    const playlistsService = useMemo(
        () => new PlaylistsService(apiService),
        [apiService],
    );

    useEffect(() => {
        const saved = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
        if (saved === 'true' || saved === 'false') {
            setSidebarOpen(saved === 'true');
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarOpen));
    }, [sidebarOpen]);

    const playlistQuery = useQuery({
        queryKey: ['playlist-details', playlistId],
        queryFn: () => playlistsService.getById(playlistId),
    });

    return (
        <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
            <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <AppSidebar />
                <SidebarInset className="relative">
                    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6">
                        <SidebarTrigger
                            aria-label="Toggle sidebar"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        />
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                                Playlist
                            </p>
                            <h1 className="text-xl font-semibold">
                                {playlistQuery.data?.name ??
                                    'Loading playlist...'}
                            </h1>
                        </div>
                    </header>

                    <div className="p-4 pb-20 md:p-6">
                        {playlistQuery.isLoading ? (
                            <Card>
                                <CardContent className="p-6 text-sm text-muted-foreground">
                                    Loading playlist songs...
                                </CardContent>
                            </Card>
                        ) : playlistQuery.error ? (
                            <Card>
                                <CardContent className="p-6 text-sm text-destructive">
                                    {playlistQuery.error instanceof Error
                                        ? playlistQuery.error.message
                                        : 'Failed to load playlist.'}
                                </CardContent>
                            </Card>
                        ) : (
                            <Card>
                                <CardContent className="p-0">
                                    {playlistQuery.data?.songs.length ? (
                                        playlistQuery.data.songs.map(
                                            (song, index) => (
                                                <div
                                                    key={song.id}
                                                    className="grid grid-cols-[32px_minmax(0,1fr)_72px] items-center gap-4 border-b border-border px-4 py-3 last:border-b-0"
                                                >
                                                    <span className="text-sm text-muted-foreground">
                                                        {index + 1}
                                                    </span>
                                                    <p className="truncate text-sm font-medium">
                                                        {song.title}
                                                    </p>
                                                    <p className="text-right text-sm text-muted-foreground">
                                                        {formatDuration(
                                                            song.duration,
                                                        )}
                                                    </p>
                                                </div>
                                            ),
                                        )
                                    ) : (
                                        <div className="p-6 text-sm text-muted-foreground">
                                            This playlist has no songs yet.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
