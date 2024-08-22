'use client';

import { StringField } from '@goran/ui-components';

export const EmailField = () => {
    return (
        <StringField
            name="email"
            type="email"
            placeholder="user@gmail.com"
            label="Email"
            withMessage
        />
    );
};
