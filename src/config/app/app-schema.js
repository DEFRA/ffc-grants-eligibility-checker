// istanbul ignore file
import Joi from 'joi';

const DEFAULT_PORT = 3000;

export const schema = Joi.object({
  name: Joi.string().required().default('ffc-grants-eligibility-checker"'),
  description: Joi.string().required().default('FFC Grant Eligibility Checker'),
  version: Joi.string().required().default('1.0.0'),
  host: Joi.string().required().default('0.0.0.0'),
  port: Joi.number().required().default(DEFAULT_PORT),
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
  }),
  local: Joi.boolean().required().default(false),
  serviceBus: {
    environment: Joi.string().required().default('development'),
    msgSrc: Joi.string().required().default('ffc-grants-eligibility-checker'),
    type: Joi.string().required().default('queue'),
    useCredentialChain: Joi.boolean().required().default(true),
    host: Joi.string(),
    notifyEmailTemplate: Joi.string(),
    queueId: Joi.string(),
    notifyEmailAddress: Joi.string()
  },
  serviceBusLocal: {
    environment: Joi.string().required().default('development'),
    connectionString: Joi.string()
      .required()
      .default(
        'Endpoint=sb://servicebus-emulator;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SAS_KEY_VALUE;UseDevelopmentEmulator=true;'
      ),
    correlationId: Joi.string().required().default('id1'),
    notifyEmailTemplate: Joi.string().required().default('local-notify-template'),
    type: Joi.string().required().default('queue'),
    msgSrc: Joi.string().required().default('ffc-grants-eligibility-checker'),
    notifyEmailAddress: Joi.string().required().default('local@email.com'),
    useCredentialChain: Joi.boolean().required().default(false),
    queueId: Joi.string().required().default('queue.1')
  }
});
