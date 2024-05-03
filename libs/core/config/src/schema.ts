import * as Joi from 'joi';

export enum CONFIG_APP {
  DRIZZLE_DATABASE_URL = 'DRIZZLE_DATABASE_URL',
  SECURITY_EXPIRES_IN = 'SECURITY_EXPIRES_IN',
  SECURITY_BCRYPT_SALT = 'SECURITY_BCRYPT_SALT',
  JWT_REFRESH_SECRET = 'JWT_REFRESH_SECRET',
  JWT_ACCESS_SECRET = 'JWT_ACCESS_SECRET',
  SECURITY_REFRESH_IN = 'SECURITY_REFRESH_IN',
}

export const configSchema = Joi.object({
  DRIZZLE_DATABASE_URL: Joi.string(),
  SECURITY_EXPIRES_IN: Joi.number().required(),
  SECURITY_BCRYPT_SALT: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
  JWT_ACCESS_SECRET: Joi.string().required(),
  SECURITY_REFRESH_IN: Joi.string().required(),
});
