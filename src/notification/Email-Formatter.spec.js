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
      notifyEmailTemplate: 'test-template',
      notifyEmailAddress: 'local-email-address',
      environment: 'developement',
      local: true
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
          notifyEmailTemplate: 'test-template',
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
          notifyEmailTemplate: 'test-template',
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

    it('should include correct email for non-local development', () => {
      const mockEmail = 'development-email-address';
      mockConfig.environment = 'development';
      mockConfig.local = false;
      mockConfig.notifyEmailAddress = mockEmail;

      emailFormatter = new EmailFormatter(mockConfig);

      const result = emailFormatter.formatSubmissionEmail(mockContext);

      expect(result.applicantEmail.emailAddress).toEqual(mockEmail);
    });

    it('should include correct email for production', () => {
      mockConfig.environment = 'production';
      mockConfig.local = false;

      emailFormatter = new EmailFormatter(mockConfig);

      const result = emailFormatter.formatSubmissionEmail(mockContext);

      expect(result.applicantEmail.emailAddress).toEqual('applicant@example.com');
    });

    it('should use config values for template', () => {
      const customConfig = {
        notifyEmailTemplate: 'custom-template'
      };
      const customFormatter = new EmailFormatter(customConfig);

      mockContext.userAnswers = {};

      const result = customFormatter.formatSubmissionEmail(mockContext);

      expect(result.applicantEmail.notifyEmailTemplate).toBe('custom-template');
    });
  });
});
