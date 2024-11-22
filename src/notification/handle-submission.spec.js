import { jest, describe, it, expect, beforeEach } from '@jest/globals';
import { handleSubmission } from './handle-submission';
import { EmailService } from './Email-Service';
import { EmailFormatter } from './Email-Formatter';

jest.mock('./Email-Service');
jest.mock('./Email-Formatter');

describe('handleSubmission', () => {
  const mockSendSubmissionEmail = jest.fn();
  const mockFormatSubmissionEmail = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    EmailService.prototype.sendSubmissionEmail = mockSendSubmissionEmail;
    EmailFormatter.prototype.formatSubmissionEmail = mockFormatSubmissionEmail;

    mockFormatSubmissionEmail.mockReturnValue({
      notifyTemplate: 'template-id',
      emailAddress: 'test@example.com',
      details: {
        countryLocation: 'Yes',
        consentOptional: true
      }
    });
  });

  it('should process machine context and send email successfully', async () => {
    mockSendSubmissionEmail.mockResolvedValue(true);

    const mockMachineContext = {
      userAnswers: {
        country: 'Yes',
        'consent-A1': true
      },
      completedPageIds: ['start', 'country', 'consent'],
      currentPageId: 'confirmation'
    };

    const result = await handleSubmission(mockMachineContext);

    expect(mockFormatSubmissionEmail).toHaveBeenCalledWith(mockMachineContext);
    expect(mockSendSubmissionEmail).toHaveBeenCalledWith(
      {
        notifyTemplate: 'template-id',
        emailAddress: 'test@example.com',
        details: {
          countryLocation: 'Yes',
          consentOptional: true
        }
      },
      expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
    );
    expect(result).toBe(true);
  });

  it('should handle email sending failure', async () => {
    mockSendSubmissionEmail.mockResolvedValue(false);

    const mockMachineContext = {
      userAnswers: {
        country: 'Yes',
        'consent-A1': true
      }
    };

    const result = await handleSubmission(mockMachineContext);
    expect(result).toBe(false);
  });
});
