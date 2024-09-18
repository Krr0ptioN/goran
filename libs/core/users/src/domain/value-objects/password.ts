import { DomainPrimitive, Guard, ValueObject } from '@goran/common';

export class PasswordValueObject extends ValueObject<string> {
    constructor(password: string) {
        super({ value: password });
    }

    protected override validate(props: DomainPrimitive<string>): void {
        if (
            Guard.isEmpty(props.value) ||
            props.value.length > 35 ||
            props.value.length < 8 ||
            !props.value.match(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]+$/
            )
        ) {
            throw new Error('Invalid password format.');
        }
    }
}
