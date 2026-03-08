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
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

function AnimatedSidebarLink({
    href,
    children,
    isActive = false,
}: {
    href: string;
    children: React.ReactNode;
    isActive?: boolean;
}) {
    return (
        <SidebarMenuButton
            asChild
            isActive={isActive}
            className="justify-start transition-colors"
        >
            <Link href={href} className="flex min-w-0 items-center gap-2">
                {children}
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

type PlaylistItem = {
    id: string;
    name: string;
    tracks: number;
};

export default function AppSidebar() {
    const pathname = usePathname();
    const [createPlaylistDialogOpen, setCreatePlaylistDialogOpen] =
        useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('New Playlist');
    const [playlists, setPlaylists] = useState<PlaylistItem[]>([]);
    const [isPlaylistsLoading, setIsPlaylistsLoading] = useState(true);
    const [playlistsError, setPlaylistsError] = useState('');
    const [isCreatingPlaylist, setIsCreatingPlaylist] = useState(false);
    const [lastCreatedPlaylistName, setLastCreatedPlaylistName] = useState('');

    useEffect(() => {
        const loadPlaylists = async () => {
            try {
                setIsPlaylistsLoading(true);
                setPlaylistsError('');
                const response = await fetch('/api/playlists', {
                    method: 'GET',
                    cache: 'no-store',
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch playlists');
                }

                const result = (await response.json()) as PlaylistItem[];
                setPlaylists(result);
            } catch {
                setPlaylistsError('Could not load playlists.');
            } finally {
                setIsPlaylistsLoading(false);
            }
        };

        void loadPlaylists();
    }, []);

    const handleCreatePlaylist = async () => {
        const name =
            newPlaylistName.trim() || `New Playlist ${playlists.length + 1}`;

        try {
            setIsCreatingPlaylist(true);
            setPlaylistsError('');

            const response = await fetch('/api/playlists', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });

            if (!response.ok) {
                throw new Error('Failed to create playlist');
            }

            const created = (await response.json()) as PlaylistItem;
            setPlaylists((current) => [created, ...current]);
            setLastCreatedPlaylistName(created.name);
            setCreatePlaylistDialogOpen(false);
            setNewPlaylistName('New Playlist');
        } catch {
            setPlaylistsError('Could not create playlist.');
        } finally {
            setIsCreatingPlaylist(false);
        }
    };

    const isActivePath = (href: string) =>
        href === '/' ? pathname === '/' : pathname.startsWith(href);

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
                                    <AnimatedSidebarLink
                                        href={item.href}
                                        isActive={isActivePath(item.href)}
                                    >
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
                                    <AnimatedSidebarLink
                                        href={item.href}
                                        isActive={isActivePath(item.href)}
                                    >
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
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    handleCreatePlaylist();
                                                }
                                            }}
                                            placeholder="Playlist name"
                                            className="bg-input border-border"
                                        />
                                        <DialogFooter>
                                            <Button
                                                variant="outline"
                                                disabled={isCreatingPlaylist}
                                                onClick={() =>
                                                    setCreatePlaylistDialogOpen(
                                                        false,
                                                    )
                                                }
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                onClick={handleCreatePlaylist}
                                                disabled={isCreatingPlaylist}
                                                className="bg-primary text-primary-foreground hover:bg-primary/90"
                                            >
                                                {isCreatingPlaylist
                                                    ? 'Creating...'
                                                    : 'Create'}
                                            </Button>
                                        </DialogFooter>
                                    </DialogContent>
                                </Dialog>
                            </SidebarMenuItem>

                            {isPlaylistsLoading ? (
                                <SidebarMenuItem>
                                    <SidebarMenuButton disabled>
                                        <ListMusic />
                                        <span>Loading playlists...</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ) : null}

                            {playlists.map((playlist) => (
                                <SidebarMenuItem key={playlist.id}>
                                    <AnimatedSidebarLink
                                        href={`/playlists/${playlist.id}`}
                                        isActive={
                                            pathname ===
                                            `/playlists/${playlist.id}`
                                        }
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
                        <p
                            aria-live="polite"
                            className="px-2 pt-2 text-xs text-muted-foreground"
                        >
                            {playlistsError
                                ? playlistsError
                                : lastCreatedPlaylistName
                                  ? `Created: ${lastCreatedPlaylistName}`
                                  : 'Create playlists to organize your listening.'}
                        </p>
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
