// istanbul ignore file
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';
import { schema } from './app-schema.js';
import crypto from 'crypto';

const currentFileName = fileURLToPath(import.meta.url);
const currentDirName = path.dirname(currentFileName);
const require = createRequire(import.meta.url);

const pkg = require(path.join(currentDirName, '../../../package.json'));

const PORT_MIN = 1024; // Minimum port number (non-privileged ports)
const PORT_MAX = 65535; // Maximum port number (highest valid port)

/**
 * Generates a random port number within the range of 1024 to 65535.
 * This is useful for dynamically assigning an available port for server instances.
 * Note that the port range is chosen to avoid privileged ports (below 1024).
 * @returns {number} A random port number.
 */
const getRandomPort = () => crypto.randomInt(PORT_MIN, PORT_MAX); // Secure random port between 1024 and 65535

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
  },
  local: process.env.LOCAL || false,
  serviceBus: {
    environment: process.env.NODE_ENV || 'development',
    msgSrc: 'ffc-grants-eligibility-checker',
    type: 'queue',
    useCredentialChain: true,
    host: process.env.SERVICE_BUS_HOST || 'live-service-bus-host',
    notifyEmailTemplate: process.env.NOTIFY_EMAIL_TEMPLATE || 'live-local-notify-template',
    queueId: process.env.NOTIFY_SUBMIT_QUEUE || 'live-submit-queue',
    notifyEmailAddress: process.env.NOTIFY_EMAIL_ADDRESS || 'live-notify-email-address'
  },
  serviceBusLocal: {
    environment: process.env.NODE_ENV || 'development',
    connectionString:
      'Endpoint=sb://servicebus-emulator;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;',
    correlationId: 'id1',
    notifyEmailTemplate: 'local-notify-template',
    type: 'queue',
    msgSrc: 'ffc-grants-eligibility-checker',
    notifyEmailAddress: 'local@email.com',
    useCredentialChain: false,
    queueId: 'queue.1'
  }
};

// Validate config
const result = schema.validate(config, {
  abortEarly: false
});

// Throw if config is invalid
if (result.error) {
  throw new Error(`The app config is invalid. ${result.error.message}`);
}

const value = result.value;
export { value as appConfig };
