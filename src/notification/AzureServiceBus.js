import { ServiceBusClient } from '@azure/service-bus';

/**
 * Class representing an Azure Service Bus.
 */
export class AzureServiceBus {
  /**
   * Construct a new AzureServiceBus instance.
   * @param {object} config - Configuration object with application settings.
   */
  constructor(config) {
    this.config = config;
    console.debug('xxxx', config);
    if (this.config.useCredentialChain) {
      this.serviceBusClient = new ServiceBusClient(config.host);
    } else {
      this.serviceBusClient = new ServiceBusClient(config.connectionString);
      this.receiver = this.serviceBusClient.createReceiver(config.queueId);
    }

    this.sender = this.serviceBusClient.createSender(config.queueId);
  }

  /**
   * Send a message to the Azure Service Bus.
   * @param {object} message - The message to send.
   * @returns {Promise<void>} A promise that resolves once the message has been
   * sent.
   */
  async sendMessage(message) {
    try {
      console.log('sendMessage debug:', this.config);
      await this.sender.sendMessages(message);
      console.log('Email sent successfully');
      if (this.config.environment === 'local') await this.checkQueue();
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }

  /**
   * A test function to check if the service bus can receive messages from
   * 'queue.1'. This function should be removed once the service bus is
   * successfully integrated.
   * @returns {Promise<void>}
   */
  async checkQueue() {
    const messages = await this.receiver.receiveMessages(5, { maxWaitTimeInMs: 1000 });
    console.log('Receiver messages');

    messages.forEach((message) => {
      console.log('Message:', message.body);
    });
  }
}
