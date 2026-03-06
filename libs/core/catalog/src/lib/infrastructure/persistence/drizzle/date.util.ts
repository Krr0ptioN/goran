export function toDateOnly(value: Date | null | undefined): string | null {
    if (!value) {
        return null;
    }

    return value.toISOString().slice(0, 10);
}

export function toDate(value: string | Date | null | undefined): Date | null {
    if (!value) {
        return null;
    }

    return value instanceof Date ? value : new Date(value);
}
