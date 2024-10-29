'use client';

import { StringField } from '@goran/ui-components';

export const FullnameField = () => {
    return (
        <StringField
            name="fullname"
            type="text"
            placeholder="Name and last name"
            label="Full Name"
            withMessage
        />
    );
};
