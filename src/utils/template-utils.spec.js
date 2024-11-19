import {
  generateConfirmationId,
  getOptions,
  hasPageErrors,
  inputOptions,
  isChecked,
  setOptionsLabel
} from './template-utils';
import { describe, it, expect } from '@jest/globals';

describe('Template utils', () => {
  describe('isChecked', () => {
    it('returns true if option is selected (radio button scenario)', () => {
      expect(isChecked('option1', 'option1')).toBe(true);
    });

    it('returns false if option is not selected (radio button scenario)', () => {
      expect(isChecked('option1', 'option2')).toBe(false);
    });

    it('returns true if option is in selected options (checkbox scenario)', () => {
      expect(isChecked(['option1', 'option2'], 'option1')).toBe(true);
    });

    it('returns false if option is not in selected options (checkbox scenario)', () => {
      expect(isChecked(['option1', 'option2'], 'option3')).toBe(false);
    });

    it('returns false if answerData is empty or null', () => {
      expect(isChecked('', 'option1')).toBe(false);
      expect(isChecked(null, 'option1')).toBe(false);
      expect(isChecked(undefined, 'option1')).toBe(false);
    });
  });

  describe('setOptionsLabel', () => {
    const answers = [
      { value: 'option1', text: 'Option 1' },
      { value: 'option2', hint: 'Hint text' },
      { value: 'divider' },
      { value: 'option3', text: 'Option 3', conditional: 'Conditional text' }
    ];

    it('sets the checked and selected properties based on data', () => {
      const data = 'option1';
      const result = setOptionsLabel(data, answers);

      expect(result).toEqual([
        { value: 'option1', text: 'Option 1', checked: true, selected: true },
        { value: 'option2', text: 'option2', hint: 'Hint text', checked: false, selected: false },
        { divider: 'or' },
        {
          value: 'option3',
          text: 'Option 3',
          conditional: 'Conditional text',
          checked: false,
          selected: false
        }
      ]);
    });

    it('returns text as value if text property is missing', () => {
      const data = 'option2';
      const result = setOptionsLabel(data, answers);

      expect(result[1].text).toBe('option2');
    });

    it('returns correct output when there is a divider', () => {
      const data = 'option3';
      const result = setOptionsLabel(data, answers);

      expect(result[2]).toEqual({ divider: 'or' });
    });

    it('returns empty array when answers is null or undefined', () => {
      expect(setOptionsLabel('option1', null)).toEqual([]);
      expect(setOptionsLabel('option1', undefined)).toEqual([]);
    });
  });

  describe('inputOptions', () => {
    const stateMeta = {
      currentPageId: 'question1',
      title: 'Sample Question',
      answers: [
        { value: 'option1', text: 'Option 1' },
        { value: 'option2', text: 'Option 2' }
      ],
      classes: 'govuk-fieldset__legend--m'
    };

    test('returns options object with correct structure', () => {
      const data = 'option1';
      const result = inputOptions(data, stateMeta);

      expect(result).toEqual({
        classes: 'govuk-fieldset__legend--m',
        id: 'question1',
        name: 'question1',
        fieldset: {
          legend: {
            text: 'Sample Question',
            isPageHeading: true,
            classes: 'govuk-fieldset__legend--m'
          }
        },
        items: [
          { value: 'option1', text: 'Option 1', checked: true, selected: true },
          { value: 'option2', text: 'Option 2', checked: false, selected: false }
        ]
      });
    });

    test('applies default class if none is specified in stateMeta', () => {
      const result = inputOptions('option1', { ...stateMeta, classes: undefined });

      expect(result.classes).toBe('govuk-fieldset__legend--l');
    });
  });

  describe('getOptions', () => {
    const getStateMeta = (questionType = 'radio') => ({
      id: 'question1',
      title: 'Sample Question',
      questionType,
      answers: [
        { value: 'option1', text: 'Option 1' },
        { value: 'option2', text: 'Option 2' }
      ]
    });

    test('calls inputOptions when questionType is radio', () => {
      const result = getOptions('option1', getStateMeta());
      expect(result).toHaveProperty('fieldset');
      expect(result.items.length).toBe(2);
    });

    test('calls inputOptions when questionType is checkbox', () => {
      const result = getOptions('option1', getStateMeta('checkbox'));
      expect(result).toHaveProperty('fieldset');
      expect(result.items.length).toBe(2);
    });

    test('returns undefined for unhandled questionType', () => {
      const result = getOptions('option1', {
        ...getStateMeta(),
        questionType: 'unknownType'
      });
      expect(result).toBeUndefined();
    });
  });

  describe('generateConfirmationId', () => {
    test('should generate a string in the format XX-XXX-XXX', () => {
      const id = generateConfirmationId();
      // Check if the ID matches the pattern: two uppercase letters, three digits, three digits
      expect(id).toMatch(/^[A-Z]{2}-\d{3}-\d{3}$/);
    });

    test('should always return an ID of length 10', () => {
      const id = generateConfirmationId();
      expect(id.length).toBe(10);
    });

    test('should generate a different ID on each call', () => {
      const id1 = generateConfirmationId();
      const id2 = generateConfirmationId();
      expect(id1).not.toBe(id2);
    });

    test('should return consistent results in multiple quick invocations', () => {
      const ids = new Set();
      for (let i = 0; i < 1000; i++) {
        ids.add(generateConfirmationId());
      }
      // The set should contain a large number of unique values
      expect(ids.size).toBeGreaterThan(900); // Adjust this number based on your needs
    });
  });

  describe('hasPageErrors', () => {
    it('should return true if the page has errors', () => {
      const errors = {
        page1: { field1: 'Error message' }
      };
      const pageId = 'page1';
      expect(hasPageErrors(errors, pageId)).toBe(true);
    });

    it('should return false if the page exists but has no errors', () => {
      const errors = {
        page1: {}
      };
      const pageId = 'page1';
      expect(hasPageErrors(errors, pageId)).toBe(false);
    });

    it('should return false if the page does not exist in errors', () => {
      const errors = {
        page1: { field1: 'Error message' }
      };
      const pageId = 'page2';
      expect(hasPageErrors(errors, pageId)).toBe(false);
    });

    it('should return false if errors object is empty', () => {
      const errors = {};
      const pageId = 'page1';
      expect(hasPageErrors(errors, pageId)).toBe(false);
    });

    it('should handle undefined errors gracefully and return false', () => {
      const errors = undefined;
      const pageId = 'page1';
      expect(hasPageErrors(errors, pageId)).toBe(false);
    });

    it('should handle null errors gracefully and return false', () => {
      const errors = null;
      const pageId = 'page1';
      expect(hasPageErrors(errors, pageId)).toBe(false);
    });

    it('should handle non-object errors gracefully and return false', () => {
      const errors = 'not-an-object';
      const pageId = 'page1';
      expect(hasPageErrors(errors, pageId)).toBe(false);
    });
  });
});
