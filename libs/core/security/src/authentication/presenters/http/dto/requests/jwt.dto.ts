export interface JwtPayloadDto {
    userId: string;
    issuedAt: number;
    expiration: number;
}
