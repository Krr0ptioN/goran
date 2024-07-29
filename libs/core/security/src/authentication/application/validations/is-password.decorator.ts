import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from 'class-validator';
import { isStrongPassword } from 'class-validator';

interface StrongPasswordOptions {
    minLength?: number;
    minSymbols?: number;
    minNumbers?: number;
    minUppercase?: number;
    minLowercase?: number;
}

/**
 * Validates that a password is strong.
 *
 * @param options - Optional settings for password strength validation.
 * @param validationOptions - Additional validation options.
 */
export function IsPassword(
    options: StrongPasswordOptions = {
        minLength: 8,
        minSymbols: 1,
        minNumbers: 1,
        minUppercase: 1,
        minLowercase: 1,
    },
    validationOptions?: ValidationOptions
) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'IsPasswordStrong',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [options],
            validator: {
                validate(value: string, args: ValidationArguments) {
                    const [options] = args.constraints;
                    return isStrongPassword(value, options);
                },
                defaultMessage() {
                    return 'Password does not meet the strength requirements.';
                },
            },
        });
    };
}
