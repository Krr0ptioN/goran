import {
    IsOptional,
    MaxLength,
    MinLength,
    IsEmail,
    IsDefined,
} from 'class-validator';

export class MailDto {
    @IsEmail()
    from: string;

    @IsEmail()
    to: string;

    @IsDefined()
    @MinLength(0)
    @MaxLength(225)
    subject: string;

    @IsOptional()
    html?: string;

    @IsDefined()
    text: string;
}
