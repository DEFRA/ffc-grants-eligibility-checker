/**
 * EmailService class responsible for sending submission emails and managing the connection to the message broker.
 */
export class EmailService {
  /**
   * Constructs an instance of EmailService.
   * Sends a message sender to the message broker.
   * @param {*} messageService
   * @param config
   */
  constructor(messageService, config) {
    this.messageService = messageService;
    this.config = config;
  }

  /**
   * Sends a submission email.
   * @param {object} submissionData - The submission data to be sent.
   * @param {string} correlationId - The correlation id.
   * @returns {Promise<boolean>} - Resolves to true if successful, false if not.
   */
  async sendSubmissionEmail(submissionData, correlationId) {
    const message = {
      body: submissionData,
      type: this.config.type,
      source: this.config.msgSrc,
      correlationId
    };

    await this.messageService.sendMessage(message);
  }
}
