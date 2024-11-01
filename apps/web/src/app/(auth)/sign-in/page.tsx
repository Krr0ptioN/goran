'use server';

import { SignInForm } from '@goran/ui-module-auth';
import Link from 'next/link';

export default async function SignIn() {
    return (
        <>
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign In</h1>
                <p className="text-balance text-lg text-muted-foreground">
                    Enter your email below to sign-in to your account
                </p>
            </div>
            <div className="grid gap-4">
                <SignInForm />
            </div>
            <div className="mt-4 text-center text-md">
                Don&apos;t have an account?{' '}
                <Link href="/sign-up" className="underline">
                    Sign up
                </Link>
            </div>
        </>
    );
}
