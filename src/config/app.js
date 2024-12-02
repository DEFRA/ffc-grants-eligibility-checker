// istanbul ignore file
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

const pkg = require(path.join(__dirname, '../../package.json'));

export const app = {
  name: pkg.name,
  description: pkg.description,
  version: pkg.version,

  host: '0.0.0.0',
  port: 3000,
  siteTitle: process.env.SITE_TITLE || 'FFC Grants Eligibility Checker',
  surveyLink: process.env.SURVEY_LINK || 'https://example.com/survey',
  sessionTimeoutInMins: process.env.SESSION_TIMEOUT_IN_MINS || '15',
  timeoutPath: process.env.TIMEOUT_PATH || '/timeout',
  environment: process.env.NODE_ENV || 'local',
  serviceBus: {
    local: {
      serviceBusConnectionString:
        process.env.SERVICE_BUS_CONNECTION_STRING ||
        'Endpoint=sb://servicebus-emulator;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;',
      correlationId: 'id1',
      notifyTemplate: 'local-notify-template'
    },
    msgSrc: 'ffc-grants-eligibility-checker',
    address: process.env.CHECKER_SUBMITTED_TOPIC_ADDRESS,
    type: 'uk.gov.ffc.grants.elegibility.notification',
    host: process.env.SERVICE_BUS_HOST,
    password: process.env.SERVICE_BUS_PASSWORD,
    username: process.env.SERVICE_BUS_USER,
    useCredentialChain: process.env.NODE_ENV || 'local',
    notifyTemplate: process.env.NOTIFY_EMAIL_TEMPLATE,
    notifyEmailAddress: process.env.NOTIFY_EMAIL_ADDRESS
  }
};
