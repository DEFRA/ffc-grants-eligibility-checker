import { AzureServiceBus } from './AzureServiceBus.js';
import { FFCMessageSender } from 'ffc-messaging';

/**
 * Returns an instance of a ServiceBus, depending on the environment.
 * In non-local environments, it returns a MessageSender configured with the contact details queue.
 * In local environment, it returns a Redis instance connected to the 'redis' host on port 6379.
 * @param app
 * @returns {object} Message sender
 */
export function getConnector(app) {
  if (app.environment === 'local') {
    return new AzureServiceBus(app.serviceBus.local.serviceBusConnectionString);
  } else {
    return new FFCMessageSender(app.serviceBus.address);
  }
}
