import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockSendMessage = jest.fn();
const mockAzureServiceBus = jest.fn().mockReturnValue({
  sendMessage: mockSendMessage
});

const mockEmailService = jest.fn().mockReturnValue({
  sendSubmissionEmail: jest.fn()
});

const mockEmailFormatter = jest.fn().mockReturnValue({
  formatSubmissionEmail: jest.fn()
});

const serviceBusLocalConfig = { id: 'service-bus-local' };
const serviceBusConfig = { id: 'service-bus' };

const mockApp = {
  serviceBusLocal: serviceBusLocalConfig,
  serviceBus: serviceBusConfig
};

jest.unstable_mockModule('./AzureServiceBus.js', () => ({
  AzureServiceBus: mockAzureServiceBus
}));

jest.unstable_mockModule('./Email-Service.js', () => ({
  EmailService: mockEmailService
}));

jest.unstable_mockModule('./Email-Formatter.js', () => ({
  EmailFormatter: mockEmailFormatter
}));

jest.unstable_mockModule('../config/app.js', () => ({
  app: mockApp
}));

const { initialiseServiceBus } = await import('./initialise-service-bus.js');

describe('initialiseServiceBus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with local config when environment is local', async () => {
    mockApp.environment = 'local';

    const result = initialiseServiceBus();

    expect(mockAzureServiceBus).toHaveBeenCalledWith(mockApp.serviceBusLocal);
    expect(mockEmailService).toHaveBeenCalledWith(expect.any(Object), mockApp.serviceBusLocal);
    expect(mockEmailFormatter).toHaveBeenCalledWith(mockApp.serviceBusLocal);

    expect(result).toEqual({
      emailService: expect.any(Object),
      emailFormatter: expect.any(Object),
      serviceBusConfig: mockApp.serviceBusLocal
    });
  });

  it('should initialize with production config when environment is not local', async () => {
    mockApp.environment = 'production';

    const result = initialiseServiceBus();

    expect(mockAzureServiceBus).toHaveBeenCalledWith(mockApp.serviceBus);

    expect(mockEmailService).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ environment: 'production' })
    );

    expect(mockEmailFormatter).toHaveBeenCalledWith(mockApp.serviceBus);

    expect(result).toEqual({
      emailService: expect.any(Object),
      emailFormatter: expect.any(Object),
      serviceBusConfig: mockApp.serviceBus
    });
  });
});
