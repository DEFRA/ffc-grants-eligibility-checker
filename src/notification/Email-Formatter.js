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
    let emailAddress;

    switch (this.config.environment) {
      case 'local':
        emailAddress = 'local-email-address';
        break;
      case 'development':
        emailAddress = this.config.testEmailAddress;
        break;
      case 'test':
        emailAddress = this.config.testEmailAddress;
        break;
      default:
        emailAddress = 'user-email-address'; // to be received from state machine
        break;
    }

    const email = {
      applicantEmail: {
        notifyTemplate: this.config.notifyTemplate,
        emailAddress,
        details: {
          firstName: 'temp-first-name', // to be received from state machine
          lastName: 'temp-last-name', // to be received from state machine
          ...this.mapMachineAnswersToEmailFields(machineContext)
        }
      }
    };
    console.log('formatSubmissionEmail', email);
    return email;
  }
}
