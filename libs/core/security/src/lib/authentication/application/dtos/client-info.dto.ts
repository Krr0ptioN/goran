import { Optional } from '@goran/common';

export interface ClientInfoDto {
    userAgent: Optional<string>;
    ip: string;
}
