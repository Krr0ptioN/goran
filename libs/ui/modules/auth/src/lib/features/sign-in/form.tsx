'use client';

import { useFormStatus, useFormState } from 'react-dom';
import { Form, Button } from '@goran/ui-components';
import { EmailField, PasswordField } from '../../components';
import { signIn } from './sign-in.action';
import {
    SignInSchema,
    initialValues,
    initialState,
    SignInValues,
} from './schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFormAction } from '@goran/ui-common';
import Link from 'next/link';

export const SignInForm = () => {
    const [state, formAction] = useFormState(signIn, initialState);
    const { pending } = useFormStatus();

    const form = useFormAction<SignInValues>({
        resolver: zodResolver(SignInSchema),
        defaultValues: initialValues,
    });

    return (
        <Form {...form}>
            <form {...form.submitAction(formAction)}>
                <EmailField />
                <PasswordField />
                <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                >
                    Forgot your password?
                </Link>
                <Button className="mt-3 w-full" type="submit">
                    Sign In
                </Button>
            </form>
        </Form>
    );
};
