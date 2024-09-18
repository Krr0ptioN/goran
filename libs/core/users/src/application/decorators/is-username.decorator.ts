import { registerDecorator, ValidationOptions } from 'class-validator';

/**
 * Validates that a username correctness.
 */
export function IsUsername(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsUsername',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: string) {
                    return /^[a-z0-9_.-]{3,17}$/.test(value);
                },
                defaultMessage() {
                    return "Only username that contain lowercase letters, numbers, '_', '-' and '.' with min 3 max 17 length";
                },
            },
        });
    };
}
