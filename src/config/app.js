// istanbul ignore file
import Joi from 'joi';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

// Define config schema
const schema = Joi.object({
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const pkg = require(path.join(__dirname, '../../package.json'));

const config = {
  // Application data
  name: pkg.name,
  description: pkg.description,
  version: pkg.version,

  host: '0.0.0.0',
  port: 3000,
  siteTitle: process.env.SITE_TITLE || 'FFC Grants Eligibility Checker',
  surveyLink: process.env.SURVEY_LINK || 'https://example.com/survey',
  sessionTimeoutInMins: process.env.SESSION_TIMEOUT_IN_MINS || '60',
  timeoutPath: process.env.TIMEOUT_PATH || '/timeout',

  cookiePassword: process.env.COOKIE_PASSWORD,
  cookieOptions: {
    ttl: process.env.SESSION_CACHE_TTL,
    encoding: 'base64json',
    isSecure: process.env.NODE_ENV === 'production',
    isHttpOnly: true,
    clearInvalid: false,
    strictHeader: false,
    isSameSite: 'Lax'
  }
};

// Validate config
const result = schema.validate(config, {
  abortEarly: false
});

// Throw if config is invalid
if (result.error) {
  throw new Error(`The cache config is invalid. ${result.error.message}`);
}

const value = result.value;
export { value as appConfig };
