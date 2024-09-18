'use client';

import { FieldValues, useForm, UseFormProps } from 'react-hook-form';

export function useFormAction<
    TFieldValues extends FieldValues = FieldValues,
    TContext = any,
    TTransformedValues extends FieldValues | undefined = undefined
>(props?: UseFormProps<TFieldValues, TContext>) {
    const form = useForm<TFieldValues, TContext, TTransformedValues>(props);

    const submitAction = (onAction: (formData: TFieldValues) => void) => {
        if (form.formState.isValid) {
            return { action: () => onAction(form.getValues()) };
        }
        return { onSubmit: form.handleSubmit(onAction as any) };
    };

    return {
        ...form,
        submitAction,
    };
}
