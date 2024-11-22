import config from '../config/notification/notification.config.js';
import { MessageSender } from 'ffc-messaging';

/**
 * EmailService class responsible for sending submission emails and managing the connection to the message broker.
 */
export class EmailService {
  /**
   * Constructs an instance of EmailService.
   * Initializes a message sender for sending emails using the configured contact details queue.
   */
  constructor() {
    this.sender = new MessageSender(config.contactDetailsQueue);
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
      type: 'uk.gov.ffc.grants.aaa.bbb.ccc.ddd',
      source: config.msgSrc,
      correlationId
    };

    console.log('sendSubmissionEmail', message);

    try {
      const result = await this.sender.sendMessage(message);
      console.log('Email Result', result);
      return true;
    } catch (error) {
      console.error('Email send failed:', error);
      return false;
    }
  }

  /**
   * Closes the connection to the message broker.
   * @returns {Promise<void>} - Resolves when the connection is closed.
   */
  async close() {
    await this.sender.closeConnection();
  }
}
