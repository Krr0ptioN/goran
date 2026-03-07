import Image from 'next/image';

export default function AuthLayout({
    children,
}: {
    readonly children: React.ReactNode;
}) {
    return (
        <div className="h-screen w-full md:grid md:min-h-[600px] md:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">{children}</div>
            </div>
            <div className="hidden bg-muted md:block">
                <Image
                    src="/placeholder.svg"
                    alt="Image"
                    width={1920}
                    height={1080}
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
