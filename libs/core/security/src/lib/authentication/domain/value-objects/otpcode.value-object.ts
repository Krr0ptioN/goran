import { ValueObject } from '@goran/common';
import otp from "otp-generator";

export class OtpCodeVO extends ValueObject<string> {
    static create() {
        return new OtpCodeVO({ value: otp.generator(6, { upperCaseAlphabets: false, specialChars: false }) });
    }

    protected validate({ value }: { value: string }): void {
        value;
        return;
    }
}
