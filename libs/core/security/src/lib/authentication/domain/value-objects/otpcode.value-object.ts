import { ValueObject } from '@goran/common';

export class OtpCodeVO extends ValueObject<string> {
    public static digits = '0123456789abcdefghijklmnopqrstuvwxyz';

    static create() {
        let otpcode = '';
        const len = OtpCodeVO.digits.length;
        for (let i = 0; i < 6; i++) {
            otpcode += OtpCodeVO.digits[Math.floor(Math.random() * len)];
        }
        return new OtpCodeVO({ value: otpcode });
    }

    protected validate({ value }: { value: string }): void {
        value;
        return;
    }
}
