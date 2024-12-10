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
    msgSrc: 'ffc-grants-eligibility-checker',
    type: 'queue',
    useCredentialChain: true,
    host: process.env.SERVICE_BUS_HOST,
    notifyTemplate: process.env.NOTIFY_EMAIL_TEMPLATE,
    queueId: process.env.NOTIFY_SUBMIT_QUEUE,
    testEmailAddress: process.env.NOTIFY_EMAIL_ADDRESS
  },
  serviceBusLocal: {
    connectionString:
      'Endpoint=sb://servicebus-emulator;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;',
    correlationId: 'id1',
    notifyTemplate: 'local-notify-template',
    type: 'queue',
    msgSrc: 'ffc-grants-eligibility-checker',
    notifyEmailAddress: 'local@email.com',
    useCredentialChain: false,
    queueId: 'queue.1'
  }
};
