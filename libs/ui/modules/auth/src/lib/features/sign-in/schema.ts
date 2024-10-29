import * as z from 'zod';

export const SignInSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, 'Password is required'),
});

export type SignInValues = z.infer<typeof SignInSchema>;

export type SignInInitialStatus = {
    errors: {
        email: undefined;
        password: undefined;
    };
    message: undefined;
};

export const signInInitialState = {
    errors: {
        email: undefined,
        password: undefined,
    },
    message: undefined,
};

export const signInInitialValues = {
    email: '',
    password: '',
};
