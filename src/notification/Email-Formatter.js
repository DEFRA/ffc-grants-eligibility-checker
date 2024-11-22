/**
 * EmailFormatter class responsible for transforming state machine submission data
 * into formatted email objects suitable for sending.
 */
export class EmailFormatter {
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
    const email = {
      notifyTemplate: process.env.NOTIFY_EMAIL_TEMPLATE,
      emailAddress: process.env.EMAIL_TO_SEND_TO,
      details: {
        ...this.mapMachineAnswersToEmailFields(machineContext),
        submissionDate: new Date().toISOString()
      }
    };
    console.log('formatSubmissionEmail', email);
    return email;
  }
}
