const { MessageSender } = require('ffc-messaging');

/**
 *
 */
export class FFCMessageSender {
  /**
   * Construct a new AzureServiceBus instance.
   * @param {string} topicName - The connection string to use to connect
   * to the service bus.
   */
  constructor(topicName) {
    this.topicName = topicName;
    this.messageSender = new MessageSender(this.topicName);
  }

  /**
   * Send a message to the Message Sender.
   * @param {object} message - The message to send.
   * @returns {Promise<void>} A promise that resolves once the message has been
   * sent.
   */
  async sendMessage(message) {
    await this.messageSender.sendMessage(message);
  }
}
