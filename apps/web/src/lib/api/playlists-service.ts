import { ApiService } from './api-service';

export type Playlist = {
    id: string;
    name: string;
    tracks: number;
};

export type PlaylistSong = {
    id: string;
    title: string;
    duration: number;
};

export type PlaylistDetails = {
    id: string;
    name: string;
    description: string | null;
    tracks: number;
    songs: PlaylistSong[];
};

export type CreatePlaylistInput = {
    name: string;
    description?: string | null;
};

export class PlaylistsService {
    constructor(private readonly api: ApiService) {}

    list() {
        return this.api.get<Playlist[]>('/api/playlists', {
            cache: 'no-store',
        });
    }

    create(input: CreatePlaylistInput) {
        return this.api.post<Playlist>('/api/playlists', input);
    }

    getById(playlistId: string) {
        return this.api.get<PlaylistDetails>(`/api/playlists/${playlistId}`, {
            cache: 'no-store',
        });
    }
}
