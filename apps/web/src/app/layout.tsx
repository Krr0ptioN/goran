import './global.css';

export const metadata = {
    title: 'Goran',
    description: 'Self-hosted personal music streaming',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
