import { fetch } from '@goran/ui-common';
import { signinSchema } from './schema';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from '@goran/ui-components';
import { EmailField, PasswordField } from '../../components';

export const SignInForm = () => {
    const form = useForm({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const navigate = useNavigate({ from: '/login' });
    const [error, setError] = useState<string>('');

    const submit = async (values: FieldValues) => {
        setError('');

        try {
            const { access_token } = await fetch('/auth/sign-in', {
                method: 'post',
                body: values,
            });
            navigate({ to: '/' });
        } catch (err: any) {
            setError(err.response._data?.detail || 'An error occurred');
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(submit)}>
                <EmailField />
                <PasswordField />
                <Button className="mt-3 w-full" type="submit">
                    Sign In
                </Button>
                {error && error}
            </form>
        </Form>
    );
};
