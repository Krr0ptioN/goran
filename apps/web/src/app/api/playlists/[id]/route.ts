import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { fetchApi } from '@goran/ui-common';

type PlaylistApiResponse = {
    id: string;
    ownerId: string;
    name: string;
    description: string | null;
    coverImageKey: string | null;
    songIds: string[];
};

type SongApiResponse = {
    id: string;
    title: string;
    duration: number;
};

const toClientPlaylistSong = (song: SongApiResponse) => ({
    id: song.id,
    title: song.title,
    duration: song.duration,
});

export async function GET(
    _request: Request,
    context: { params: Promise<{ id: string }> },
) {
    const accessToken = (await cookies()).get('session-access')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const playlistResponse = await fetchApi(
        `/playlists/${id}`,
        {
            method: 'GET',
            cache: 'no-store',
        },
        accessToken,
    );

    if (!playlistResponse.ok) {
        return NextResponse.json(
            { error: 'Failed to load playlist' },
            { status: playlistResponse.status },
        );
    }

    const playlist = (await playlistResponse.json()) as PlaylistApiResponse;

    const songsResponse = await fetchApi(
        '/songs',
        {
            method: 'GET',
            cache: 'no-store',
        },
        accessToken,
    );

    const songs = songsResponse.ok
        ? ((await songsResponse.json()) as SongApiResponse[])
        : [];
    const songsById = new Map(songs.map((song) => [song.id, song]));

    const playlistSongs = playlist.songIds
        .map((songId) => songsById.get(songId))
        .filter((song): song is SongApiResponse => Boolean(song))
        .map(toClientPlaylistSong);

    return NextResponse.json({
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        tracks: playlistSongs.length,
        songs: playlistSongs,
    });
}
