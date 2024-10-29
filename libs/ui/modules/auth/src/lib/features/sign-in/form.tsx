'use client';

import { useFormStatus } from 'react-dom';
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
    const { pending } = useFormStatus();

    const form = useFormAction<SignInValues>({
        resolver: zodResolver(SignInSchema),
        defaultValues: signInInitialValues,
    });

    const handleSubmit = async (data: SignInValues) => {
        const result = await signIn(data);
        if (result.errors) {
            console.error('Sign In Error:', result.errors);
        } else {
            router.push('/');
        }
    };

    return (
        <Form {...form}>
            <form {...form.submitAction(handleSubmit)}>
                <EmailField />
                <PasswordField />
                <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                >
                    Forgot your password?
                </Link>
                <Button
                    className="mt-3 w-full"
                    type="submit"
                    disabled={pending}
                >
                    Sign In
                </Button>
            </form>
        </Form>
    );
};
