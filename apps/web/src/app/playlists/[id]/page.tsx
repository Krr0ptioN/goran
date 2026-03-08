import { PlaylistDetailsPage } from './_components/playlist-details-page';

export default async function PlaylistPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    return <PlaylistDetailsPage playlistId={id} />;
}
