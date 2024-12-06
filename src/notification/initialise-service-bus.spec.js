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

const mockApp = {
  environment: 'local',
  serviceBusLocal: {
    serviceBusConnectionString: 'test-connection',
    correlationId: 'test-correlation',
    notifyTemplate: 'test-template'
  },
  serviceBus: {
    host: 'test-host',
    address: 'test-address'
  }
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

    expect(mockAzureServiceBus).toHaveBeenCalledWith(
      expect.objectContaining({
        serviceBusConnectionString: 'test-connection',
        correlationId: 'test-correlation',
        notifyTemplate: 'test-template',
        environment: 'local'
      })
    );

    expect(mockEmailService).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ environment: 'local' })
    );

    expect(mockEmailFormatter).toHaveBeenCalledWith(mockApp);

    expect(result).toEqual({
      emailService: expect.any(Object),
      emailFormatter: expect.any(Object),
      config: expect.objectContaining({ environment: 'local' })
    });
  });

  it('should initialize with production config when environment is not local', async () => {
    mockApp.environment = 'production';

    const result = initialiseServiceBus();

    expect(mockAzureServiceBus).toHaveBeenCalledWith(
      expect.objectContaining({
        host: 'test-host',
        address: 'test-address',
        environment: 'production'
      })
    );

    expect(mockEmailService).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ environment: 'production' })
    );

    expect(mockEmailFormatter).toHaveBeenCalledWith(mockApp);

    expect(result).toEqual({
      emailService: expect.any(Object),
      emailFormatter: expect.any(Object),
      config: expect.objectContaining({ environment: 'production' })
    });
  });

  it('should return properly structured initialization object', async () => {
    const result = initialiseServiceBus();

    expect(result).toEqual({
      emailService: expect.any(Object),
      emailFormatter: expect.any(Object),
      config: expect.any(Object)
    });
  });
});
