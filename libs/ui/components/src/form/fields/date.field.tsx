'use client';

import { type FC, useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@goran/ui-common';
import { useFormContext, type FieldValues } from 'react-hook-form';
import {
    Popover,
    PopoverTrigger,
    FormControl,
    PopoverContent,
    Button,
    Calendar,
} from '../..';
import { FormLabel, FormItem, FormField, FormMessage } from '../form';

interface DateFieldProps {
    name: keyof FieldValues;
    label: string;
}

function parseISODate(isoDateString: string): Date | undefined {
    const date = new Date(isoDateString);
    return isNaN(date.getTime()) ? undefined : date;
}

const useDateField = (name: string) => {
    const form = useFormContext();

    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        parseISODate(form.getValues(name))
    );

    useEffect(() => {
        const newValue = selectedDate?.toISOString().slice(0, -5);
        const prevValue = form.getValues(name);
        if (newValue !== prevValue) {
            form.setValue(name, newValue, {
                shouldValidate: true,
                shouldTouch: true,
                shouldDirty: true,
            });
        }
    }, [form, name, selectedDate]);

    return { form, selectedDate, setSelectedDate };
};

export const DateField: FC<DateFieldProps> = ({ name, label }) => {
    const { form, selectedDate, setSelectedDate } = useDateField(name);

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col mt-2 w-full">
                    <FormLabel>{label}</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    variant={'outline'}
                                    className={cn(
                                        'w-full pl-3 text-left font-normal',
                                        !field.value && 'text-muted-foreground'
                                    )}
                                >
                                    {field.value ? (
                                        format(field.value + 'Z', 'PPP')
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto w-4 h-4 opacity-50" />
                                </Button>
                            </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-auto" align="start">
                            <Calendar
                                mode="single"
                                {...field}
                                selected={selectedDate}
                                onSelect={(date) => {
                                    setSelectedDate(date);
                                }}
                                disabled={(date) => date < new Date()}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
