import Link from 'next/link';
import { Button, Card, CardContent } from '@goran/ui-components';

type RoutePlaceholderPageProps = {
    params: Promise<{ slug: string[] }>;
};

export default async function RoutePlaceholderPage({
    params,
}: RoutePlaceholderPageProps) {
    const { slug } = await params;
    const path = `/${slug.join('/')}`;

    return (
        <main className="flex min-h-svh items-center justify-center bg-background px-6 py-12 text-foreground">
            <Card className="w-full max-w-lg border-border">
                <CardContent className="space-y-4 p-6">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Coming Soon
                    </p>
                    <h1 className="text-2xl font-semibold">
                        This section is not ready yet
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        The page{' '}
                        <code className="rounded bg-muted px-1 py-0.5">
                            {path}
                        </code>{' '}
                        is part of the dashboard shell and will be connected in
                        the next feature pass.
                    </p>
                    <Button asChild>
                        <Link href="/">Back to dashboard</Link>
                    </Button>
                </CardContent>
            </Card>
        </main>
    );
}
