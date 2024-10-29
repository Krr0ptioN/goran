'use client';

import { useFormStatus } from 'react-dom';
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
    const { pending } = useFormStatus();

    const form = useFormAction<SignUpValues>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: signUpInitialValues,
    });

    const handleSubmit = async (data: SignUpValues) => {
        const result = await signUp(data);
        if (result.errors) {
            console.error('Sign Up Error:', result.errors);
        } else {
            router.push('/');
        }
    };

    return (
        <Form {...form}>
            <form {...form.submitAction(handleSubmit)}>
                <FullnameField />
                <UsernameField />
                <EmailField />
                <PasswordField />
                <Button
                    className="mt-3 w-full"
                    type="submit"
                    disabled={pending}
                >
                    Sign Up
                </Button>
            </form>
        </Form>
    );
};
