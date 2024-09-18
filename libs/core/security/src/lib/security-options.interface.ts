export interface SecurityOptions {
    expiresIn: string;
    refreshIn: string;
    bcryptSalt: string;
    jwtRefreshSecret: string;
    jwtAccessSecret: string;
}
