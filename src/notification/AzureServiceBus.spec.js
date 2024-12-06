import { jest } from '@jest/globals';

const sendMessages = jest.fn();
const receiveMessages = jest.fn();
const createSender = jest.fn().mockReturnValue({
  sendMessages
});
const createReceiver = jest.fn().mockReturnValue({
  receiveMessages
});
const ServiceBusClient = jest.fn().mockImplementation(() => ({
  createSender,
  createReceiver
}));

jest.mock('@azure/service-bus', () => ({
  ServiceBusClient
}));

const { AzureServiceBus } = await import('./AzureServiceBus');

describe('AzureServiceBus', () => {
  let azureServiceBus;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      serviceBusConnectionString: 'test-connection-string',
      environment: 'local'
    };
    azureServiceBus = new AzureServiceBus(mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('initializes with config and creates clients', () => {
      expect(azureServiceBus.config).toBe(mockConfig);
      expect(ServiceBusClient).toHaveBeenCalledWith(mockConfig.serviceBusConnectionString);
      expect(azureServiceBus.serviceBusClient.createSender).toHaveBeenCalledWith('queue.1');
      expect(azureServiceBus.serviceBusClient.createReceiver).toHaveBeenCalledWith('queue.1');
    });
  });

  describe('sendMessage', () => {
    it('sends message successfully and checks queue in local env', async () => {
      const message = { content: 'test message' };
      await azureServiceBus.sendMessage(message);

      expect(azureServiceBus.sender.sendMessages).toHaveBeenCalledWith(message);
    });

    it('handles errors when sending message fails', async () => {
      const error = new Error('Send failed');
      azureServiceBus.sender.sendMessages.mockRejectedValueOnce(error);
      console.error = jest.fn();

      await azureServiceBus.sendMessage({});
      expect(console.error).toHaveBeenCalledWith('Error sending email:', error);
    });

    it('does not check queue when not in local environment', async () => {
      azureServiceBus.config.environment = 'production';
      jest.spyOn(azureServiceBus, 'checkQueue');

      await azureServiceBus.sendMessage({});
      expect(azureServiceBus.checkQueue).not.toHaveBeenCalled();
    });
  });

  describe('checkQueue', () => {
    it('receives and logs messages', async () => {
      const mockMessages = [{ body: 'message 1' }, { body: 'message 2' }];
      azureServiceBus.receiver.receiveMessages.mockResolvedValueOnce(mockMessages);
      console.log = jest.fn();

      await azureServiceBus.checkQueue();

      expect(azureServiceBus.receiver.receiveMessages).toHaveBeenCalledWith(5, {
        maxWaitTimeInMs: 1000
      });
      expect(console.log).toHaveBeenCalledWith('Message:', 'message 1');
      expect(console.log).toHaveBeenCalledWith('Message:', 'message 2');
    });
  });
});
