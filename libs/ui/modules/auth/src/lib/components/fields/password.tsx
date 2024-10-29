'use client';

import { StringField } from '@goran/ui-components';

export const PasswordField = () => {
    return (
        <StringField
            name="password"
            type="password"
            placeholder="Strong password"
            label="Password"
            withMessage
        />
    );
};
