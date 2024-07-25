import * as Joi from 'joi';

export enum CONFIG_APP {
  // Server
  SERVER_PORT = 'SERVER_PORT',
  SERVER_ADDRESS = 'SERVER_ADDRES',
  DRIZZLE_DATABASE_URL = 'DRIZZLE_DATABASE_URL',
  SECURITY_EXPIRES_IN = 'SECURITY_EXPIRES_IN',
  SECURITY_BCRYPT_SALT = 'SECURITY_BCRYPT_SALT',
  JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET',
  JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET',
  SECURITY_REFRESH_IN = 'SECURITY_REFRESH_IN',
  RESEND_GORAN_API = 'RESEND_GORAN_API',
  MAIL_INFRASTRUCTURE = 'MAIL_INFRASTRUCTURE',
  SERVER_PASSWORD_RESET_URL = 'SERVER_PASSWORD_RESET_URL',
}

export const configSchema = Joi.object({
  SERVER_PORT: Joi.number().optional().default(3000),
  SERVER_ADDRESS: Joi.string().optional().default('localhost'),
  DRIZZLE_DATABASE_URL: Joi.string(),
  SECURITY_EXPIRES_IN: Joi.number().required(),
  SECURITY_BCRYPT_SALT: Joi.number().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  SECURITY_REFRESH_IN: Joi.string().required(),
  MAIL_INFRASTRUCTURE: Joi.string()
    .valid('RESEND', 'NODEMAILER')
    .default('NODEMAILER'),
  RESEND_GORAN_API: Joi.string(),
  SERVER_PASSWORD_RESET_URL: Joi.string().required(),
});
