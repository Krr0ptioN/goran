'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Avatar,
    AvatarFallback,
    Badge,
    Button,
    Card,
    CardContent,
    Input,
    Progress,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
    Skeleton,
} from '@goran/ui-components';
import {
    Headphones,
    Pause,
    Play,
    Search,
    Shuffle,
    SkipBack,
    SkipForward,
    Upload,
    Volume2,
    VolumeX,
    X,
} from 'lucide-react';
import AppSidebar from './app-sidebar';

type Track = {
    id: string;
    title: string;
    artist: string;
    album: string;
    durationSec: number;
};

const SIDEBAR_STORAGE_KEY = 'dashboard.sidebar.open';

const quickMixes = [
    {
        id: 'mix1',
        title: 'Midnight Focus',
        subtitle: 'Synthwave and lo-fi',
        accent: 'from-cyan-500/30 to-blue-500/10',
        startingTrackId: 't1',
    },
    {
        id: 'mix2',
        title: 'Sunday Vinyl',
        subtitle: 'Soul, jazz and classics',
        accent: 'from-amber-500/30 to-orange-500/10',
        startingTrackId: 't2',
    },
    {
        id: 'mix3',
        title: 'Deep Work',
        subtitle: 'Ambient, instrumental',
        accent: 'from-emerald-500/30 to-teal-500/10',
        startingTrackId: 't3',
    },
];

const trendingTracks: Track[] = [
    {
        id: 't1',
        title: 'Atlas',
        artist: 'Nova Hall',
        album: 'Echoes',
        durationSec: 221,
    },
    {
        id: 't2',
        title: 'Blue Hour',
        artist: 'Waveside',
        album: 'Sea Glass',
        durationSec: 242,
    },
    {
        id: 't3',
        title: 'Pixel Heart',
        artist: 'Kairo',
        album: 'Afterglow',
        durationSec: 178,
    },
    {
        id: 't4',
        title: 'Starlit',
        artist: 'Mira Stone',
        album: 'Skyline',
        durationSec: 199,
    },
];

const releases = [
    { id: 'r1', name: 'Skyline', artist: 'Mira Stone', trackId: 't4' },
    { id: 'r2', name: 'Afterglow', artist: 'Kairo', trackId: 't3' },
    { id: 'r3', name: 'Sea Glass', artist: 'Waveside', trackId: 't2' },
];

function getRandomIndex(length: number) {
    if (length <= 0) {
        return 0;
    }

    if (typeof globalThis.crypto !== 'undefined') {
        const randomBuffer = new Uint32Array(1);
        globalThis.crypto.getRandomValues(randomBuffer);
        return randomBuffer[0] % length;
    }

    return 0;
}

function formatDuration(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function MusicApp() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [elapsedSec, setElapsedSec] = useState(0);
    const [isMuted, setIsMuted] = useState(false);
    const searchInputRef = useRef<HTMLInputElement | null>(null);

    const filteredTracks = useMemo(() => {
        if (!query.trim()) {
            return trendingTracks;
        }

        const needle = query.trim().toLowerCase();
        return trendingTracks.filter(
            (track) =>
                track.title.toLowerCase().includes(needle) ||
                track.artist.toLowerCase().includes(needle) ||
                track.album.toLowerCase().includes(needle),
        );
    }, [query]);

    const currentTrack =
        trendingTracks[currentTrackIndex] ?? trendingTracks[0] ?? null;

    useEffect(() => {
        const saved = window.localStorage.getItem(SIDEBAR_STORAGE_KEY);
        if (saved === 'true' || saved === 'false') {
            setSidebarOpen(saved === 'true');
        }
        const timer = window.setTimeout(() => {
            setIsLoading(false);
        }, 320);
        return () => window.clearTimeout(timer);
    }, []);

    useEffect(() => {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        if (!isPlaying || !currentTrack) {
            return;
        }

        const timer = window.setInterval(() => {
            setElapsedSec((current) => {
                if (current >= currentTrack.durationSec) {
                    setCurrentTrackIndex(
                        (index) => (index + 1) % trendingTracks.length,
                    );
                    return 0;
                }
                return current + 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [isPlaying, currentTrack]);

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.key === '/' && !(event.metaKey || event.ctrlKey)) {
                const target = event.target as HTMLElement | null;
                const isTypingContext =
                    target?.tagName === 'INPUT' ||
                    target?.tagName === 'TEXTAREA' ||
                    target?.isContentEditable;
                if (!isTypingContext) {
                    event.preventDefault();
                    searchInputRef.current?.focus();
                }
            }

            if (event.key === 'Escape') {
                setQuery('');
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const playTrackById = (trackId: string) => {
        const index = trendingTracks.findIndex((track) => track.id === trackId);
        if (index >= 0) {
            setCurrentTrackIndex(index);
            setElapsedSec(0);
            setIsPlaying(true);
        }
    };

    const playTrackByIndex = (index: number) => {
        setCurrentTrackIndex(index);
        setElapsedSec(0);
        setIsPlaying(true);
    };

    const goToPreviousTrack = () => {
        setCurrentTrackIndex((index) =>
            index <= 0 ? trendingTracks.length - 1 : index - 1,
        );
        setElapsedSec(0);
    };

    const goToNextTrack = () => {
        setCurrentTrackIndex((index) => (index + 1) % trendingTracks.length);
        setElapsedSec(0);
    };

    const shuffleTrack = () => {
        if (!trendingTracks.length) {
            return;
        }
        const randomIndex = getRandomIndex(trendingTracks.length);
        setCurrentTrackIndex(randomIndex);
        setElapsedSec(0);
        setIsPlaying(true);
    };

    const progressValue = currentTrack
        ? Math.round((elapsedSec / currentTrack.durationSec) * 100)
        : 0;

    return (
        <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
            <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <AppSidebar />
                <SidebarInset className="relative">
                    <motion.header
                        initial={{ y: -16, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{
                            type: 'spring',
                            stiffness: 90,
                            damping: 16,
                            mass: 0.7,
                        }}
                        className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:px-6"
                    >
                        <SidebarTrigger
                            aria-label="Toggle sidebar"
                            className="text-muted-foreground transition-colors hover:text-foreground"
                        />
                        <div className="relative flex-1 max-w-2xl">
                            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <Input
                                ref={searchInputRef}
                                className="pl-9 pr-9"
                                value={query}
                                onChange={(event) =>
                                    setQuery(event.currentTarget.value)
                                }
                                placeholder="Search tracks, artists, albums..."
                                aria-label="Search tracks"
                            />
                            {query ? (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-1 top-1 h-7 w-7"
                                    aria-label="Clear search"
                                    onClick={() => setQuery('')}
                                >
                                    <X className="size-4" />
                                </Button>
                            ) : null}
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Button size="sm" variant="secondary">
                                <Upload className="size-4" />
                                Upload
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={shuffleTrack}
                            >
                                <Shuffle className="size-4" />
                                Shuffle
                            </Button>
                        </div>
                        <Avatar className="size-8 bg-primary text-primary-foreground">
                            <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                    </motion.header>

                    <div className="p-4 pb-28 md:p-6 md:pb-28">
                        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
                            <div className="space-y-6">
                                <motion.section
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.05 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold">
                                            Made for you
                                        </h2>
                                        <Button variant="ghost" size="sm">
                                            See all
                                        </Button>
                                    </div>
                                    <div className="grid gap-4 md:grid-cols-3">
                                        {quickMixes.map((mix) => (
                                            <Card
                                                key={mix.id}
                                                className={`overflow-hidden border-border bg-gradient-to-br ${mix.accent}`}
                                            >
                                                <CardContent className="space-y-3 p-4">
                                                    <Badge
                                                        variant="secondary"
                                                        className="w-fit"
                                                    >
                                                        Daily Mix
                                                    </Badge>
                                                    <div>
                                                        <h3 className="font-semibold">
                                                            {mix.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            {mix.subtitle}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        size="sm"
                                                        className="w-full"
                                                        onClick={() =>
                                                            playTrackById(
                                                                mix.startingTrackId,
                                                            )
                                                        }
                                                    >
                                                        <Play className="size-4" />
                                                        Play now
                                                    </Button>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </motion.section>

                                <motion.section
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="space-y-4"
                                >
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-semibold">
                                            Trending today
                                        </h2>
                                        <Button variant="ghost" size="sm">
                                            View chart
                                        </Button>
                                    </div>

                                    {isLoading ? (
                                        <Card>
                                            <CardContent className="space-y-3 p-4">
                                                <Skeleton className="h-10 w-full" />
                                                <Skeleton className="h-10 w-full" />
                                                <Skeleton className="h-10 w-full" />
                                            </CardContent>
                                        </Card>
                                    ) : filteredTracks.length ? (
                                        <Card>
                                            <CardContent className="p-0">
                                                {filteredTracks.map(
                                                    (track, index) => {
                                                        const absoluteIndex =
                                                            trendingTracks.findIndex(
                                                                (candidate) =>
                                                                    candidate.id ===
                                                                    track.id,
                                                            );
                                                        const isCurrent =
                                                            currentTrack?.id ===
                                                            track.id;
                                                        return (
                                                            <button
                                                                type="button"
                                                                key={track.id}
                                                                onClick={() =>
                                                                    playTrackByIndex(
                                                                        absoluteIndex,
                                                                    )
                                                                }
                                                                className="grid w-full grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_56px] items-center gap-4 border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/40 last:border-b-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                                            >
                                                                <span className="text-sm text-muted-foreground">
                                                                    {index + 1}
                                                                </span>
                                                                <div className="min-w-0">
                                                                    <p
                                                                        className={`truncate font-medium ${isCurrent ? 'text-primary' : ''}`}
                                                                    >
                                                                        {
                                                                            track.title
                                                                        }
                                                                    </p>
                                                                    <p className="truncate text-xs text-muted-foreground">
                                                                        {
                                                                            track.artist
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <p className="truncate text-sm text-muted-foreground">
                                                                    {
                                                                        track.album
                                                                    }
                                                                </p>
                                                                <p className="text-right text-sm text-muted-foreground">
                                                                    {formatDuration(
                                                                        track.durationSec,
                                                                    )}
                                                                </p>
                                                            </button>
                                                        );
                                                    },
                                                )}
                                            </CardContent>
                                        </Card>
                                    ) : (
                                        <Card>
                                            <CardContent className="p-6 text-sm text-muted-foreground">
                                                No tracks found for &quot;
                                                {query}&quot;. Try another
                                                keyword.
                                            </CardContent>
                                        </Card>
                                    )}
                                </motion.section>
                            </div>

                            <motion.aside
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="space-y-4"
                            >
                                <Card>
                                    <CardContent className="space-y-4 p-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">
                                                Now playing
                                            </h3>
                                            <Headphones className="size-4 text-muted-foreground" />
                                        </div>
                                        <div className="aspect-square rounded-lg border border-border bg-gradient-to-br from-indigo-500/40 to-cyan-500/20" />
                                        <div>
                                            <p className="font-medium">
                                                {currentTrack?.title ??
                                                    'No track selected'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {currentTrack?.artist ??
                                                    'Pick a track to start'}
                                            </p>
                                        </div>
                                        <Progress value={progressValue} />
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>
                                                {formatDuration(elapsedSec)}
                                            </span>
                                            <span>
                                                {formatDuration(
                                                    currentTrack?.durationSec ??
                                                        0,
                                                )}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="space-y-3 p-4">
                                        <h3 className="font-semibold">
                                            New releases
                                        </h3>
                                        {releases.map((release) => (
                                            <div
                                                key={release.id}
                                                className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2"
                                            >
                                                <div className="min-w-0">
                                                    <p className="truncate text-sm font-medium">
                                                        {release.name}
                                                    </p>
                                                    <p className="truncate text-xs text-muted-foreground">
                                                        {release.artist}
                                                    </p>
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0"
                                                    aria-label={`Play ${release.name}`}
                                                    onClick={() =>
                                                        playTrackById(
                                                            release.trackId,
                                                        )
                                                    }
                                                >
                                                    <Play className="size-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </CardContent>
                                </Card>
                            </motion.aside>
                        </div>
                    </div>

                    <div className="sticky bottom-0 border-t border-border bg-background/95 px-4 py-3 backdrop-blur">
                        <div className="flex items-center gap-4">
                            <div className="hidden size-11 rounded-md border border-border bg-gradient-to-br from-indigo-500/40 to-cyan-500/20 sm:block" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    {currentTrack?.title ?? 'No track selected'}
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    {currentTrack?.artist ??
                                        'Choose a track to begin'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Previous track"
                                    onClick={goToPreviousTrack}
                                >
                                    <SkipBack className="size-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    aria-label={
                                        isPlaying
                                            ? 'Pause playback'
                                            : 'Play track'
                                    }
                                    onClick={() =>
                                        setIsPlaying((value) => !value)
                                    }
                                >
                                    {isPlaying ? (
                                        <Pause className="size-4" />
                                    ) : (
                                        <Play className="size-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Next track"
                                    onClick={goToNextTrack}
                                >
                                    <SkipForward className="size-4" />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:inline-flex"
                                aria-label={isMuted ? 'Unmute' : 'Mute'}
                                onClick={() => setIsMuted((value) => !value)}
                            >
                                {isMuted ? (
                                    <VolumeX className="size-4" />
                                ) : (
                                    <Volume2 className="size-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
