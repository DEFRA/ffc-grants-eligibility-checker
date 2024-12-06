import { AzureServiceBus } from './AzureServiceBus.js';
import { EmailService } from './Email-Service.js';
import { EmailFormatter } from './Email-Formatter.js';
import { app } from '../config/app.js';

/**
 * Initialises the Azure Service Bus and its dependencies and returns them in an object.
 * @returns {object} An object containing the initialised Azure Service Bus, EmailService and EmailFormatter.
 */
export const initialiseServiceBus = () => {
  const environment = app.environment;
  const config = environment === 'local' ? app.serviceBusLocal : app.serviceBus;
  config.environment = environment;

  const connector = new AzureServiceBus(config);
  const emailService = new EmailService(connector, config);
  const emailFormatter = new EmailFormatter(app);

  return { emailService, emailFormatter, config };
};
