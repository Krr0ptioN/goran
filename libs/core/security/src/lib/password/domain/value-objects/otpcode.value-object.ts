import { ValueObject } from '@goran/common';
import * as otp from "otp-generator";

export class OtpCodeVO extends ValueObject<string> {
    static create() {
        return new OtpCodeVO({ value: otp.generate(6, { upperCaseAlphabets: false, specialChars: false }) });
    }

    protected validate({ value }: { value: string }): void {
        value;
        return;
    }
}
