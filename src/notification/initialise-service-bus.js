import { AzureServiceBus } from './AzureServiceBus.js';
import { EmailService } from './Email-Service.js';
import { EmailFormatter } from './Email-Formatter.js';
import { appConfig } from '../config/app/app-config.js';

/**
 * Initialises the Azure Service Bus and its dependencies and returns them in an object.
 * @returns {object} An object containing the initialised Azure Service Bus, EmailService and EmailFormatter.
 */
export const initialiseServiceBus = () => {
  console.log('initialiseServiceBus', appConfig);
  const serviceBusConfig = appConfig.local ? appConfig.serviceBusLocal : appConfig.serviceBus;
  serviceBusConfig.local = appConfig.local;
  const connector = new AzureServiceBus(serviceBusConfig);
  const emailService = new EmailService(connector, serviceBusConfig);
  const emailFormatter = new EmailFormatter(serviceBusConfig);

  return { emailService, emailFormatter, serviceBusConfig };
};
