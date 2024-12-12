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
    const applicantEmail = 'applicant@example.com'; // to be received from state machine

    let emailAddress;

    if (this.config.local) {
      emailAddress = this.config.notifyEmailAddress;
    } else {
      emailAddress =
        this.config.environment === 'development' ? this.config.notifyEmailAddress : applicantEmail;
    }

    const email = {
      applicantEmail: {
        notifyEmailTemplate: this.config.notifyEmailTemplate,
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
