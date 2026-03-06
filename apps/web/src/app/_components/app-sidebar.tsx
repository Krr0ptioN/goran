'use client';

import type React from 'react';

import {
    Button,
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Input,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarSeparator,
} from '@goran/ui-components';
import {
    Clock,
    Disc3,
    FolderIcon as FolderMusic,
    Heart,
    Home,
    LibraryBig,
    ListMusic,
    Mic,
    Music,
    Plus,
    Search,
    Waves,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

function AnimatedSidebarLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <SidebarMenuButton
            asChild
            className="relative overflow-hidden hover:bg-muted transition-colors"
        >
            <Link
                href={href}
                className="flex items-center gap-2 min-w-0 relative z-10"
            >
                {children}
                <motion.div
                    className="absolute inset-0 z-0"
                    initial={{
                        opacity: 0,
                        backgroundPositionX: '100%',
                        boxShadow: '0 0 0px hsl(var(--primary) / 0)',
                    }}
                    whileHover={{
                        opacity: 1,
                        backgroundPositionX: '-100%',
                        boxShadow: '0 0 20px hsl(var(--primary) / 0.8)',
                        transition: {
                            backgroundPositionX: {
                                duration: 1.5,
                                ease: 'linear',
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: 'loop',
                            },
                            opacity: { duration: 0.4 },
                            boxShadow: { duration: 0.4 },
                        },
                    }}
                    style={{
                        background:
                            'linear-gradient(90deg, hsl(var(--primary) / 0) 0%, hsl(var(--primary) / 0.9) 15%, hsl(var(--primary) / 0.9) 85%, hsl(var(--primary) / 0) 100%)',
                        backgroundSize: '300% 100%',
                        pointerEvents: 'none',
                    }}
                />
            </Link>
        </SidebarMenuButton>
    );
}

const primaryLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/search', label: 'Search', icon: Search },
    { href: '/your-library', label: 'Your Library', icon: LibraryBig },
];

const libraryLinks = [
    { href: '/recents', label: 'Recently Played', icon: Clock },
    { href: '/liked-songs', label: 'Liked Songs', icon: Heart },
    { href: '/albums', label: 'Albums', icon: Disc3 },
    { href: '/artists', label: 'Artists', icon: Mic },
    { href: '/songs', label: 'Songs', icon: Music },
    { href: '/local-files', label: 'Local Files', icon: FolderMusic },
];

const queueTracks = [
    { id: 'q1', title: 'Neon Circuit', artist: 'Mira Stone' },
    { id: 'q2', title: 'Cold Suns', artist: 'Kairo' },
    { id: 'q3', title: 'City Lights', artist: 'Waveside' },
];

const initialPlaylists = [
    { id: 'p1', name: 'Night Drive', tracks: 21 },
    { id: 'p2', name: 'Focus Hour', tracks: 34 },
    { id: 'p3', name: 'Sunday Vinyl', tracks: 18 },
];

export default function AppSidebar() {
    const [createPlaylistDialogOpen, setCreatePlaylistDialogOpen] =
        useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('New Playlist');
    const [playlists, setPlaylists] = useState(initialPlaylists);

    const handleCreatePlaylist = () => {
        const name =
            newPlaylistName.trim() || `New Playlist ${playlists.length + 1}`;
        setPlaylists((current) => [
            { id: `p${Date.now()}`, name, tracks: 0 },
            ...current,
        ]);
        setCreatePlaylistDialogOpen(false);
        setNewPlaylistName('New Playlist');
    };

    return (
        <Sidebar
            variant="inset"
            collapsible="icon"
            className="bg-sidebar text-sidebar-foreground"
        >
            <SidebarHeader>
                <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                    className="flex items-center gap-2 px-2"
                >
                    <Waves className="size-6 text-primary drop-shadow-[0_0_15px_hsl(var(--primary)/0.6)]" />
                    <div className="font-semibold tracking-tight">Goran</div>
                </motion.div>
            </SidebarHeader>

            <SidebarSeparator />

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {primaryLinks.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <AnimatedSidebarLink href={item.href}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </AnimatedSidebarLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                        Library
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {libraryLinks.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <AnimatedSidebarLink href={item.href}>
                                        <item.icon />
                                        <span>{item.label}</span>
                                    </AnimatedSidebarLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                        Queue
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {queueTracks.map((track) => (
                                <SidebarMenuItem key={track.id}>
                                    <SidebarMenuButton className="flex-col items-start h-auto py-2">
                                        <span className="font-medium truncate w-full">
                                            {track.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground truncate w-full">
                                            {track.artist}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarSeparator />

                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground">
                        Playlists
                    </SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <Dialog
                                    open={createPlaylistDialogOpen}
                                    onOpenChange={setCreatePlaylistDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <SidebarMenuButton className="relative overflow-hidden hover:bg-muted transition-colors">
                                            <Plus />
                                            <span>Create Playlist</span>
                                        </SidebarMenuButton>
                                    </DialogTrigger>
                                    <DialogContent className="bg-card border-border">
                                        <DialogHeader>
                                            <DialogTitle>
                                                Create playlist
                                            </DialogTitle>
                                        </DialogHeader>
                                        <Input
                                            value={newPlaylistName}
                                            onChange={(e) =>
                                                setNewPlaylistName(
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Playlist name"
                                            className="bg-input border-border"
                                        />
                                        <DialogFooter>
                                            <Button
                                                onClick={handleCreatePlaylist}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                            >
                                                Create
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </SidebarMenuItem>

                            {playlists.map((playlist) => (
                                <SidebarMenuItem key={playlist.id}>
                                    <AnimatedSidebarLink
                                        href={`/playlists/${playlist.id}`}
                                    >
                                        <ListMusic />
                                        <div className="min-w-0">
                                            <div className="truncate">
                                                {playlist.name}
                                            </div>
                                            <div className="text-xs text-muted-foreground">
                                                {playlist.tracks} tracks
                                            </div>
                                        </div>
                                    </AnimatedSidebarLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <div className="px-2 text-xs text-muted-foreground">
                    Made by{' '}
                    <Link
                        href="https://mardin.cc"
                        className="text-primary font-bold"
                    >
                        Mardin.cc
                    </Link>
                </div>
            </SidebarFooter>

            <SidebarRail />
        </Sidebar>
    );
}
