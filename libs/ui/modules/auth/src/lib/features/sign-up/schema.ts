import { z } from 'zod';

export const SignUpSchema = z.object({
    fullname: z.string().optional(),
    username: z
        .string()
        .min(5, { message: 'Name must be at least 2 characters long.' })
        .trim(),
    email: z.string().email({ message: 'Please enter a valid email.' }).trim(),
    password: z
        .string()
        .min(8, { message: 'Be at least 8 characters long' })
        .regex(/[a-z]/, { message: 'Contain at least one lowercase letter.' })
        .regex(/[A-Z]/, { message: 'Contain at least one uppercase letter.' })
        .regex(/\d/, { message: 'Contain at least one number.' })
        .regex(/[^a-zA-Z0-9]/, {
            message: 'Contain at least one special character.',
        })
        .trim(),
});

export type SignUpValues = z.infer<typeof SignUpSchema>;

export type SignUpInitialStatus = {
    errors: {
        email: string[] | undefined;
        username: string[] | undefined;
        fullname: string[] | undefined;
        password: string[] | undefined;
    };
    message: undefined;
};

export const signUpInitialState = {
    errors: {
        email: undefined,
        username: undefined,
        fullname: undefined,
        password: undefined,
    },
    message: undefined,
};

export const signUpInitialValues = {
    email: '',
    password: '',
};
