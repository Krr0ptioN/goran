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
    createdAt: string;
    updatedAt: string;
};

type CreatePlaylistPayload = {
    name?: string;
    description?: string | null;
};

const toClientPlaylist = (playlist: PlaylistApiResponse) => ({
    id: playlist.id,
    name: playlist.name,
    tracks: playlist.songIds.length,
});

async function resolveUserId(accessToken: string) {
    const userResponse = await fetchApi(
        '/auth/@me',
        {
            method: 'GET',
            cache: 'no-store',
        },
        accessToken,
    );

    if (!userResponse.ok) {
        return null;
    }

    const payload = await userResponse.json();
    return payload?.data?.userId ?? null;
}

export async function GET() {
    const accessToken = (await cookies()).get('session-access')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const response = await fetchApi(
        '/playlists',
        {
            method: 'GET',
            cache: 'no-store',
        },
        accessToken,
    );

    if (!response.ok) {
        return NextResponse.json(
            { error: 'Failed to load playlists' },
            { status: response.status },
        );
    }

    const playlists = (await response.json()) as PlaylistApiResponse[];
    return NextResponse.json(playlists.map(toClientPlaylist));
}

export async function POST(request: Request) {
    const accessToken = (await cookies()).get('session-access')?.value;

    if (!accessToken) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const payload = (await request.json()) as CreatePlaylistPayload;
    const name = payload.name?.trim();

    if (!name) {
        return NextResponse.json(
            { error: 'Playlist name is required' },
            { status: 400 },
        );
    }

    const ownerId = await resolveUserId(accessToken);

    if (!ownerId) {
        return NextResponse.json(
            { error: 'Unable to resolve current user' },
            { status: 401 },
        );
    }

    const createResponse = await fetchApi(
        '/playlists',
        {
            method: 'POST',
            body: JSON.stringify({
                ownerId,
                name,
                description: payload.description ?? null,
                songIds: [],
            }),
        },
        accessToken,
    );

    if (!createResponse.ok) {
        return NextResponse.json(
            { error: 'Failed to create playlist' },
            { status: createResponse.status },
        );
    }

    const created = (await createResponse.json()) as PlaylistApiResponse;
    return NextResponse.json(toClientPlaylist(created), { status: 201 });
}
