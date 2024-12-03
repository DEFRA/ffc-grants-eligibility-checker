// istanbul ignore file
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { schema } from './app-schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const pkg = require(path.join(__dirname, '../../package.json'));

/**
 * Generates a random port number within the range of 1024 to 65535.
 * This is useful for dynamically assigning an available port for server instances.
 * Note that the port range is chosen to avoid privileged ports (below 1024).
 * @returns {number} A random port number.
 */
const getRandomPort = () => Math.floor(Math.random() * (65535 - 1024) + 1024); // Random port between 1024 and 65535

const config = {
  // Application data
  name: pkg.name,
  description: pkg.description,
  version: pkg.version,

  host: '0.0.0.0',
  port: process.env.PORT === '0' ? getRandomPort() : process.env.PORT,
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
    isSameSite: 'Strict'
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
