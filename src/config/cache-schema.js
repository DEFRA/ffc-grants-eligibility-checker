// istanbul ignore file
import Joi from 'joi';

export const schema = Joi.object({
  useRedis: Joi.bool().default(false),
  expiresIn: Joi.number().default(60 * 60 * 1000), // 1 hour
  catboxOptions: Joi.object({
    host: Joi.string().required(),
    port: Joi.string().required(),
    password: Joi.string().allow('').optional(),
    partition: Joi.string().required(),
    tls: Joi.object().optional()
  })
});
