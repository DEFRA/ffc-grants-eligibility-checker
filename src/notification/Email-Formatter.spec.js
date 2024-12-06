import { EmailFormatter } from './Email-Formatter.js';

describe('EmailFormatter', () => {
  let emailFormatter;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      notifyTemplate: 'test-template',
      notifyEmailAddress: 'test@example.com'
    };
    emailFormatter = new EmailFormatter(mockConfig);
  });

  describe('mapMachineAnswersToEmailFields', () => {
    it('should map user answers to email fields based on answer mapping', () => {
      const mockContext = {
        userAnswers: {
          country: 'Yes',
          'consent-A1': true
        }
      };

      const result = emailFormatter.mapMachineAnswersToEmailFields(mockContext);

      expect(result).toEqual({
        countryLocation: 'Yes',
        consentOptional: true
      });
    });

    it('should ignore unmapped fields', () => {
      const mockContext = {
        userAnswers: {
          country: 'Yes',
          'unknown-field': 'value'
        }
      };

      const result = emailFormatter.mapMachineAnswersToEmailFields(mockContext);

      expect(result).toEqual({
        countryLocation: 'Yes'
      });
    });

    it('should return empty object if no user answers match mapping', () => {
      const mockContext = {
        userAnswers: {
          'unknown-field': 'value'
        }
      };

      const result = emailFormatter.mapMachineAnswersToEmailFields(mockContext);

      expect(result).toEqual({});
    });

    it('should handle empty user answers', () => {
      const mockContext = {
        userAnswers: {}
      };

      const result = emailFormatter.mapMachineAnswersToEmailFields(mockContext);

      expect(result).toEqual({});
    });
  });

  describe('formatSubmissionEmail', () => {
    it('should format email with mapped answers and default fields', () => {
      const mockContext = {
        userAnswers: {
          country: 'Yes',
          'consent-A1': true
        }
      };

      const expectedEmail = {
        applicantEmail: {
          notifyTemplate: 'test-template',
          emailAddress: 'test@example.com',
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
      const mockContext = {
        userAnswers: {
          'unknown-field': 'value'
        }
      };

      const expectedEmail = {
        applicantEmail: {
          notifyTemplate: 'test-template',
          emailAddress: 'test@example.com',
          details: {
            firstName: 'temp-first-name',
            lastName: 'temp-last-name'
          }
        }
      };

      const result = emailFormatter.formatSubmissionEmail(mockContext);

      expect(result).toEqual(expectedEmail);
    });

    it('should use config values for template and email address', () => {
      const customConfig = {
        notifyTemplate: 'custom-template',
        notifyEmailAddress: 'custom@example.com'
      };
      const customFormatter = new EmailFormatter(customConfig);

      const mockContext = {
        userAnswers: {}
      };

      const result = customFormatter.formatSubmissionEmail(mockContext);

      expect(result.applicantEmail.notifyTemplate).toBe('custom-template');
      expect(result.applicantEmail.emailAddress).toBe('custom@example.com');
    });
  });
});
