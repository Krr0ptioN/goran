'use server';

import { SignUpForm } from '@goran/ui-module-auth';
import Link from 'next/link';

export default async function SignIn() {
    return (
        <>
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-balance text-lg text-muted-foreground">
                    Enter your crednetials below to sign-up to your account
                </p>
            </div>
            <div className="grid gap-4">
                <SignUpForm />
            </div>
            <div className="mt-4 text-center text-md">
                Do you already have an account?{' '}
                <Link href="/sign-in" className="underline">
                    Sign In
                </Link>
            </div>
        </>
    );
}
