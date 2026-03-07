'use client';

import { useState } from 'react';
import { Form, Button } from '@goran/ui-components';
import {
    FullnameField,
    EmailField,
    PasswordField,
    UsernameField,
} from '../../components';
import { signUp } from './sign-up.action';
import { SignUpSchema, signUpInitialValues, SignUpValues } from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormAction } from '@goran/ui-common';
import { useRouter } from 'next/navigation';

export const SignUpForm = () => {
    const router = useRouter();
    const [submitError, setSubmitError] = useState<string | null>(null);

    const form = useFormAction<SignUpValues>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: signUpInitialValues,
    });

    const handleSubmit = async (data: SignUpValues) => {
        setSubmitError(null);

        try {
            const result = await signUp(data);

            if (result.errors) {
                console.error('Sign Up Error:', result.errors);
                setSubmitError(
                    result.message ?? 'Unable to sign up right now.',
                );
                return;
            }

            router.push('/');
        } catch (error) {
            console.error('Sign Up Error:', error);
            setSubmitError('Unable to sign up right now.');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FullnameField />
                <UsernameField />
                <EmailField />
                <PasswordField />
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
                    Sign Up
                </Button>
            </form>
        </Form>
    );
};
