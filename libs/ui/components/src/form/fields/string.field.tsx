'use client';

import { useFormContext } from 'react-hook-form';
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '../form';
import { Input } from '../../input';
import { FC } from 'react';

interface StringFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    desc?: string;
    withMessage?: boolean;
    type?: "url" | "tel" | "text" | "email" | "password";
}

export const StringField: FC<StringFieldProps> = ({
    name,
    label,
    placeholder = '',
    desc,
    withMessage,
    type = 'text',
}) => {
    const form = useFormContext();

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormControl>
                        <Input
                            type={type}
                            placeholder={placeholder}
                            {...field}
                        />
                    </FormControl>
                    {desc && <FormDescription>{desc}</FormDescription>}
                    {withMessage && <FormMessage />}
                </FormItem>
            )}
        />
    );
};
