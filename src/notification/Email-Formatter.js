/**
 * EmailFormatter class responsible for transforming state machine submission data
 * into formatted email objects suitable for sending.
 */
export class EmailFormatter {
  /**
   * Construct a new EmailFormatter instance.
   * @param {object} config - Configuration object with application settings.
   */
  constructor(config) {
    this.config = config;
  }

  /**
   * Maps state machine answer keys to email template fields
   * @type {object}
   * @private
   */
  static #answerMapping = {
    country: 'countryLocation',
    'consent-A1': 'consentOptional'
  };

  /**
   * Transforms raw state machine submission data into a formatted email data object.
   * @param {object} machineContext - The state machine context containing user answers
   * @returns {object} - The formatted email data object.
   */
  mapMachineAnswersToEmailFields(machineContext) {
    const { userAnswers } = machineContext;

    return Object.entries(userAnswers).reduce((acc, [key, value]) => {
      const mappedKey = EmailFormatter.#answerMapping[key];
      if (mappedKey) {
        acc[mappedKey] = value;
      }
      return acc;
    }, {});
  }

  /**
   * Transforms raw state machine submission data into a formatted email data object.
   * @param {object} machineContext - The state machine context containing user answers
   * @returns {object} - The formatted email data object.
   */
  formatSubmissionEmail(machineContext) {
    const env = this.config.environment;
    const email = {
      applicantEmail: {
        notifyTemplate:
          env === 'local'
            ? this.config.serviceBus.notifyTemplate
            : this.config.serviceBus.local.notifyTemplate,
        emailAddress:
          env === 'local'
            ? this.config.serviceBus.notifyEmailAddress
            : this.config.serviceBus.local.notifyEmailAddress,
        details: {
          firstName: 'temp-first-name',
          lastName: 'temp-last-name',
          ...this.mapMachineAnswersToEmailFields(machineContext)
        }
      }
    };
    console.log('formatSubmissionEmail', email);
    return email;
  }
}
