'use client';

import { StringField } from '@goran/ui-components';

export const UsernameField = () => {
    return (
        <StringField
            name="username"
            type="text"
            placeholder="name"
            label="Username"
            withMessage
        />
    );
};
