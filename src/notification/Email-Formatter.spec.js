import { EmailFormatter } from './Email-Formatter.js';

describe('EmailFormatter', () => {
  let emailFormatter;
  let mockConfig;

  const mockContext = {
    userAnswers: {
      country: 'Yes',
      'consent-A1': true
    }
  };

  beforeEach(() => {
    mockConfig = {
      notifyTemplate: 'test-template',
      notifyEmailAddress: 'test@example.com',
      environment: 'local'
    };
    emailFormatter = new EmailFormatter(mockConfig);
  });

  describe('mapMachineAnswersToEmailFields', () => {
    it('should map user answers to email fields based on answer mapping', () => {
      const result = emailFormatter.mapMachineAnswersToEmailFields(mockContext);

      expect(result).toEqual({
        countryLocation: 'Yes',
        consentOptional: true
      });
    });

    it('should ignore unmapped fields', () => {
      mockContext.userAnswers = {
        country: 'Yes',
        'unknown-field': 'value'
      };

      const result = emailFormatter.mapMachineAnswersToEmailFields(mockContext);

      expect(result).toEqual({
        countryLocation: 'Yes'
      });
    });

    it('should return empty object if no user answers match mapping', () => {
      mockContext.userAnswers = {
        'unknown-field': 'value'
      };

      const result = emailFormatter.mapMachineAnswersToEmailFields(mockContext);

      expect(result).toEqual({});
    });

    it('should handle empty user answers', () => {
      mockContext.userAnswers = {};

      const result = emailFormatter.mapMachineAnswersToEmailFields(mockContext);

      expect(result).toEqual({});
    });
  });

  describe('formatSubmissionEmail', () => {
    it('should format email with mapped answers and default fields', () => {
      mockContext.userAnswers = {
        country: 'Yes',
        'consent-A1': true
      };

      const expectedEmail = {
        applicantEmail: {
          notifyTemplate: 'test-template',
          emailAddress: 'local-email-address',
          details: {
            firstName: 'temp-first-name',
            lastName: 'temp-last-name',
            countryLocation: 'Yes',
            consentOptional: true
          }
        }
      };

      const result = emailFormatter.formatSubmissionEmail(mockContext);

      expect(result).toEqual(expectedEmail);
    });

    it('should format email with only default fields when no mapped answers exist', () => {
      mockContext.userAnswers = {
        'unknown-field': 'value'
      };

      const expectedEmail = {
        applicantEmail: {
          notifyTemplate: 'test-template',
          emailAddress: 'local-email-address',
          details: {
            firstName: 'temp-first-name',
            lastName: 'temp-last-name'
          }
        }
      };

      const result = emailFormatter.formatSubmissionEmail(mockContext);

      expect(result).toEqual(expectedEmail);
    });

    it('should include correct email for development', () => {
      const mockEmail = 'development-email-address';
      mockConfig.environment = 'development';
      mockConfig.testEmailAddress = mockEmail;

      emailFormatter = new EmailFormatter(mockConfig);

      const result = emailFormatter.formatSubmissionEmail(mockContext);

      expect(result.applicantEmail.emailAddress).toEqual(mockEmail);
    });

    it('should include correct email for test', () => {
      const mockEmail = 'development-email-address';
      mockConfig.environment = 'test';
      mockConfig.testEmailAddress = mockEmail;

      emailFormatter = new EmailFormatter(mockConfig);

      const result = emailFormatter.formatSubmissionEmail(mockContext);

      expect(result.applicantEmail.emailAddress).toEqual(mockEmail);
    });

    it('should use config values for template', () => {
      const customConfig = {
        notifyTemplate: 'custom-template'
      };
      const customFormatter = new EmailFormatter(customConfig);

      mockContext.userAnswers = {};

      const result = customFormatter.formatSubmissionEmail(mockContext);

      expect(result.applicantEmail.notifyTemplate).toBe('custom-template');
    });
  });
});
