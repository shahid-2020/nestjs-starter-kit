import * as Joi from 'joi';

export const envSchema = Joi.object({
  PORT: Joi.number().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  THROTTLE_TTL_SEC: Joi.number().required(),
  THROTTLE_LIMIT: Joi.number().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_SECRET_EXPIRES: Joi.string().required(),
  FR_BASE_URL: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string().required(),
  GOOGLE_CLIENT_SECRET: Joi.string().required(),
  SENDER_EMAIL: Joi.string().required(),
  EMAIL_USERNAME: Joi.string().required(),
  EMAIL_PASSWORD: Joi.string().required(),
  EMAIL_HOST: Joi.string().required(),
  EMAIL_PORT: Joi.number().required(),
});
