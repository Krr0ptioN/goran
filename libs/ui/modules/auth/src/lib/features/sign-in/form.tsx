'use client';

import { useState } from 'react';
import { Form, Button } from '@goran/ui-components';
import { EmailField, PasswordField } from '../../components';
import { signIn } from './sign-in.action';
import { SignInSchema, signInInitialValues, SignInValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormAction } from '@goran/ui-common';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export const SignInForm = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useFormAction<SignInValues>({
        resolver: zodResolver(SignInSchema),
        defaultValues: signInInitialValues,
    });

    const handleSubmit = async (data: SignInValues) => {
        setSubmitError(null);

        try {
            const result = await signIn(data);

            if (result.errors) {
                console.error('Sign In Error:', result.errors);
                setSubmitError(
                    result.message ?? 'Unable to sign in right now.',
                );
                return;
            }

            router.push('/');
        } catch (error) {
            console.error('Sign In Error:', error);
            setSubmitError('Unable to sign in right now.');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <EmailField />
                <PasswordField />
                <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                >
                    Forgot your password?
                </Link>
                {submitError ? (
                    <p className="text-sm font-medium text-destructive">
                        {submitError}
                    </p>
                ) : null}
                <Button
                    className="mt-3 w-full"
                    type="submit"
                    disabled={form.formState.isSubmitting}
                >
                    Sign In
                </Button>
            </form>
        </Form>
    );
};
