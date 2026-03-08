'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    CreatePlaylistInput,
    Playlist,
    PlaylistsService,
} from '../../lib/api/playlists-service';

const PLAYLISTS_QUERY_KEY = ['playlists'];

export function usePlaylists(playlistsService: PlaylistsService) {
    const queryClient = useQueryClient();

    const playlistsQuery = useQuery({
        queryKey: PLAYLISTS_QUERY_KEY,
        queryFn: () => playlistsService.list(),
    });

    const createPlaylistMutation = useMutation({
        mutationFn: (input: CreatePlaylistInput) =>
            playlistsService.create(input),
        onSuccess: (created) => {
            queryClient.setQueryData<Playlist[]>(
                PLAYLISTS_QUERY_KEY,
                (current) => (current ? [created, ...current] : [created]),
            );
        },
    });

    return {
        playlists: playlistsQuery.data ?? [],
        playlistsError:
            playlistsQuery.error instanceof Error
                ? playlistsQuery.error.message
                : '',
        isPlaylistsLoading: playlistsQuery.isLoading,
        createPlaylist: createPlaylistMutation.mutateAsync,
        createPlaylistError:
            createPlaylistMutation.error instanceof Error
                ? createPlaylistMutation.error.message
                : '',
        isCreatingPlaylist: createPlaylistMutation.isPending,
    };
}
