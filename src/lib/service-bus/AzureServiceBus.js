import { ServiceBusClient } from '@azure/service-bus';

/**
 *
 */
export class AzureServiceBus {
  /**
   * Construct a new AzureServiceBus instance.
   * @param {string} connectionString - The connection string to use to connect
   * to the service bus.
   */
  constructor(connectionString) {
    this.connectionString = connectionString;
    this.serviceBusClient = new ServiceBusClient(this.connectionString);
    this.sender = this.serviceBusClient.createSender('queue.1');
  }

  /**
   * Send a message to the Azure Service Bus.
   * @param {object} message - The message to send.
   * @returns {Promise<void>} A promise that resolves once the message has been
   * sent.
   */
  async sendMessage(message) {
    await this.sender.sendMessages(message);
  }

  /**
   * A test function to check if the service bus can receive messages from
   * 'queue.1'. This function should be removed once the service bus is
   * successfully integrated.
   * @returns {Promise<void>}
   */
  async checkQueue() {
    const receiver = this.serviceBusClient.createReceiver('queue.1');

    try {
      const messages = await receiver.receiveMessages(5, { maxWaitTimeInMs: 1000 });
      console.log('Receiver messages');

      messages.forEach((message) => {
        console.log('Message:', message.body);
      });
    } finally {
      await receiver.close();
    }
  }
}
