import * as Joi from 'joi';

export enum CONFIG_APP {
    // Server
    SERVER_PORT = 'SERVER_PORT',
    SERVER_ADDRESS = 'SERVER_ADDRES',
    // Database
    DB_HOST = 'DB_HOST',
    DB_PORT = 'DB_PORT',
    DB_USER = 'DB_USER',
    DB_PASSWORD = 'DB_PASSWORD',
    DB_DATABASE = 'DB_DATABASE',

    // Security
    SECURITY_EXPIRES_IN = 'SECURITY_EXPIRES_IN',
    SECURITY_BCRYPT_SALT = 'SECURITY_BCRYPT_SALT',
    SECURITY_REFRESH_IN = 'SECURITY_REFRESH_IN',

    // JWT
    JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET',
    JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET',

    // Mail
    MAIL_INFRASTRUCTURE = 'MAIL_INFRASTRUCTURE',
    RESEND_GORAN_API = 'RESEND_GORAN_API',
    MAIL_EMAIL_ADDRESS = 'MAIL_EMAIL_ADDRESS',
    MAIL_EMAIL_PASSWORD = 'MAIL_EMAIL_PASSWORD',

    SERVER_PASSWORD_RESET_URL = 'SERVER_PASSWORD_RESET_URL',
}

export const configSchema = Joi.object({
    SERVER_PORT: Joi.number().optional().default(3000),
    SERVER_ADDRESS: Joi.string().optional().default('localhost'),

    // Database
    DB_HOST: Joi.string(),
    DB_PORT: Joi.number(),
    DB_USER: Joi.string(),
    DB_PASSWORD: Joi.string(),
    DB_DATABASE: Joi.string().default('goran-db'),

    // Security
    SECURITY_EXPIRES_IN: Joi.number().required(),
    SECURITY_BCRYPT_SALT: Joi.number().required(),
    JWT_REFRESH_SECRET: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().required(),
    SECURITY_REFRESH_IN: Joi.string().required(),

    // Mail
    MAIL_INFRASTRUCTURE: Joi.string()
        .valid('RESEND', 'NODEMAILER')
        .default('NODEMAILER'),
    RESEND_GORAN_API: Joi.string(),
    MAIL_EMAIL_ADDRESS: Joi.string().email(),
    MAIL_EMAIL_PASSWORD: Joi.string(),

    SERVER_PASSWORD_RESET_URL: Joi.string().required(),
});
