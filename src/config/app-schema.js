// istanbul ignore file
import Joi from 'joi';

export const schema = Joi.object({
  name: Joi.string().required().default('ffc-grants-eligibility-checker"'),
  description: Joi.string().required().default('FFC Grant Eligibility Checker'),
  version: Joi.string().required().default('1.0.0'),
  host: Joi.string().required().default('0.0.0.0'),
  port: Joi.number().required().default(3000),
  siteTitle: Joi.string().required().default('FFC Grants Eligibility Checker'),
  surveyLink: Joi.string().required().default('https://example.com/survey'),
  sessionTimeoutInMins: Joi.string().required().default('60'),
  timeoutPath: Joi.string().required().default('/timeout'),

  cookiePassword: Joi.string().required(),
  cookieOptions: Joi.object({
    ttl: Joi.number()
      .required()
      .default(60 * 60 * 1000),
    encoding: Joi.string().required(),
    isSecure: Joi.boolean().required(),
    isHttpOnly: Joi.boolean().required(),
    clearInvalid: Joi.boolean().required(),
    strictHeader: Joi.boolean().required(),
    isSameSite: Joi.string().required()
  })
});
