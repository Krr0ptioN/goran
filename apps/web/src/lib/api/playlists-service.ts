import { ApiService } from './api-service';

export type Playlist = {
    id: string;
    name: string;
    tracks: number;
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
}
