import { jest, describe, it, expect, beforeEach } from '@jest/globals';

const mockSubmissionEmail = {
  notifyEmailTemplate: 'template-id',
  emailAddress: 'test@example.com',
  details: {
    countryLocation: 'Yes',
    consentOptional: true
  }
};

const mockFormatSubmissionEmail = jest.fn().mockReturnValue(mockSubmissionEmail);
const mockSendSubmissionEmail = jest.fn();

const emailService = { sendSubmissionEmail: mockSendSubmissionEmail };
const emailFormatter = { formatSubmissionEmail: mockFormatSubmissionEmail };

const localConfig = {
  environment: 'local',
  correlationId: 'local-correlation-id'
};

const prodConfig = {
  environment: 'production'
};

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('mocked-uuid')
}));

let currentConfig = localConfig;
jest.unstable_mockModule('./initialise-service-bus', () => ({
  initialiseServiceBus: jest.fn().mockImplementation(() => ({
    emailService,
    emailFormatter,
    serviceBusConfig: currentConfig
  }))
}));

const { handleSubmission } = await import('./handle-submission');

describe('handleSubmission', () => {
  const mockMachineContext = {
    userAnswers: {
      country: 'Yes',
      'consent-A1': true
    },
    completedPageIds: ['start', 'country', 'consent'],
    currentPageId: 'confirmation'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should use local correlation ID when environment is local', async () => {
    await handleSubmission(mockMachineContext);
    expect(mockFormatSubmissionEmail).toHaveBeenCalledWith(mockMachineContext);
    expect(mockSendSubmissionEmail).toHaveBeenCalledWith(
      mockSubmissionEmail,
      'local-correlation-id'
    );
  });

  it('should properly format and send email in production environments', async () => {
    currentConfig = prodConfig;
    await handleSubmission(mockMachineContext);
    expect(mockFormatSubmissionEmail).toHaveBeenCalledWith(mockMachineContext);
    expect(mockSendSubmissionEmail).toHaveBeenCalledWith(mockSubmissionEmail, 'mocked-uuid');
  });
});
