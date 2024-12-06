import { jest } from '@jest/globals';

import { EmailService } from './Email-Service.js';

describe('EmailService', () => {
  let emailService;
  let mockMessageService;
  let mockConfig;

  beforeEach(() => {
    mockMessageService = {
      sendMessage: jest.fn().mockResolvedValue(undefined)
    };

    mockConfig = {
      type: 'test-message-type',
      msgSrc: 'test-message-source'
    };

    emailService = new EmailService(mockMessageService, mockConfig);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    it('should initialize with message service and config', () => {
      expect(emailService.messageService).toBe(mockMessageService);
      expect(emailService.config).toBe(mockConfig);
    });
  });

  describe('sendSubmissionEmail', () => {
    const mockSubmissionData = {
      applicantEmail: {
        notifyTemplate: 'test-template',
        emailAddress: 'test@example.com',
        details: {
          firstName: 'John',
          lastName: 'Doe'
        }
      }
    };
    const mockCorrelationId = '123-456-789';

    it('should call sendMessage with correctly formatted message', async () => {
      await expect(
        emailService.sendSubmissionEmail(mockSubmissionData, mockCorrelationId)
      ).resolves.not.toThrow();

      expect(mockMessageService.sendMessage).toHaveBeenCalledWith({
        body: mockSubmissionData,
        type: mockConfig.type,
        source: mockConfig.msgSrc,
        correlationId: mockCorrelationId
      });

      expect(mockMessageService.sendMessage).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from message service', async () => {
      const error = new Error('Message sending failed');
      mockMessageService.sendMessage.mockRejectedValueOnce(error);

      await expect(
        emailService.sendSubmissionEmail(mockSubmissionData, mockCorrelationId)
      ).rejects.toThrow('Message sending failed');
    });

    it('should handle empty submission data', async () => {
      await emailService.sendSubmissionEmail({}, mockCorrelationId);

      expect(mockMessageService.sendMessage).toHaveBeenCalledWith({
        body: {},
        type: mockConfig.type,
        source: mockConfig.msgSrc,
        correlationId: mockCorrelationId
      });
    });

    it('should handle null correlation ID', async () => {
      await emailService.sendSubmissionEmail(mockSubmissionData, null);

      expect(mockMessageService.sendMessage).toHaveBeenCalledWith({
        body: mockSubmissionData,
        type: mockConfig.type,
        source: mockConfig.msgSrc,
        correlationId: null
      });
    });
  });
});
