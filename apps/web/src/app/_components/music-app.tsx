'use client';

import React from 'react';
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
} from '@goran/ui-components';
import {
    Headphones,
    Play,
    Search,
    Shuffle,
    SkipBack,
    SkipForward,
    Upload,
    Volume2,
} from 'lucide-react';
import AppSidebar from './app-sidebar';

const quickMixes = [
    {
        title: 'Midnight Focus',
        subtitle: 'Synthwave and lo-fi',
        accent: 'from-cyan-500/30 to-blue-500/10',
    },
    {
        title: 'Sunday Vinyl',
        subtitle: 'Soul, jazz and classics',
        accent: 'from-amber-500/30 to-orange-500/10',
    },
    {
        title: 'Deep Work',
        subtitle: 'Ambient, instrumental',
        accent: 'from-emerald-500/30 to-teal-500/10',
    },
];

const trendingTracks = [
    {
        id: 't1',
        title: 'Atlas',
        artist: 'Nova Hall',
        album: 'Echoes',
        duration: '3:41',
    },
    {
        id: 't2',
        title: 'Blue Hour',
        artist: 'Waveside',
        album: 'Sea Glass',
        duration: '4:02',
    },
    {
        id: 't3',
        title: 'Pixel Heart',
        artist: 'Kairo',
        album: 'Afterglow',
        duration: '2:58',
    },
    {
        id: 't4',
        title: 'Starlit',
        artist: 'Mira Stone',
        album: 'Skyline',
        duration: '3:19',
    },
];

const releases = [
    { id: 'r1', name: 'Skyline', artist: 'Mira Stone' },
    { id: 'r2', name: 'Afterglow', artist: 'Kairo' },
    { id: 'r3', name: 'Sea Glass', artist: 'Waveside' },
];

export default function MusicApp() {
    return (
        <div className="min-h-svh bg-background text-foreground relative overflow-hidden">
            <SidebarProvider defaultOpen>
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
                        className="sticky top-0 z-20 flex items-center gap-4 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 bg-background/90 border-b border-border"
                    >
                        <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors" />
                        <div className="relative flex-1 max-w-2xl">
                            <Search className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                            <Input
                                className="pl-9"
                                placeholder="Search tracks, artists, albums..."
                            />
                        </div>
                        <div className="hidden md:flex items-center gap-2">
                            <Button size="sm" variant="secondary">
                                <Upload className="size-4" />
                                Upload
                            </Button>
                            <Button size="sm" variant="outline">
                                <Shuffle className="size-4" />
                                Shuffle
                            </Button>
                        </div>
                        <Avatar className="size-8 bg-primary text-primary-foreground">
                            <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                    </motion.header>

                    <div className="p-6 pb-28">
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
                                                key={mix.title}
                                                className={`overflow-hidden border-border bg-gradient-to-br ${mix.accent}`}
                                            >
                                                <CardContent className="p-4 space-y-3">
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
                                    <Card>
                                        <CardContent className="p-0">
                                            {trendingTracks.map(
                                                (track, index) => (
                                                    <div
                                                        key={track.id}
                                                        className="grid grid-cols-[32px_minmax(0,1fr)_minmax(0,1fr)_56px] items-center gap-4 px-4 py-3 border-b last:border-b-0 border-border"
                                                    >
                                                        <span className="text-sm text-muted-foreground">
                                                            {index + 1}
                                                        </span>
                                                        <div className="min-w-0">
                                                            <p className="truncate font-medium">
                                                                {track.title}
                                                            </p>
                                                            <p className="truncate text-xs text-muted-foreground">
                                                                {track.artist}
                                                            </p>
                                                        </div>
                                                        <p className="truncate text-sm text-muted-foreground">
                                                            {track.album}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground text-right">
                                                            {track.duration}
                                                        </p>
                                                    </div>
                                                ),
                                            )}
                                        </CardContent>
                                    </Card>
                                </motion.section>
                            </div>

                            <motion.aside
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.15 }}
                                className="space-y-4"
                            >
                                <Card>
                                    <CardContent className="p-4 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold">
                                                Now playing
                                            </h3>
                                            <Headphones className="size-4 text-muted-foreground" />
                                        </div>
                                        <div className="aspect-square rounded-lg bg-gradient-to-br from-indigo-500/40 to-cyan-500/20 border border-border" />
                                        <div>
                                            <p className="font-medium">
                                                Neon Circuit
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                Mira Stone
                                            </p>
                                        </div>
                                        <Progress value={38} />
                                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                                            <span>1:22</span>
                                            <span>3:41</span>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4 space-y-3">
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

                    <div className="sticky bottom-0 bg-background/95 backdrop-blur border-t border-border px-4 py-3">
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block size-11 rounded-md bg-gradient-to-br from-indigo-500/40 to-cyan-500/20 border border-border" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    Neon Circuit
                                </p>
                                <p className="truncate text-xs text-muted-foreground">
                                    Mira Stone
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon">
                                    <SkipBack className="size-4" />
                                </Button>
                                <Button size="icon">
                                    <Play className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon">
                                    <SkipForward className="size-4" />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="hidden md:inline-flex"
                            >
                                <Volume2 className="size-4" />
                            </Button>
                        </div>
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
