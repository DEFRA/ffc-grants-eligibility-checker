import crypto from 'crypto';

/**
 * Checks if a given option is selected in a set of selectable options (e.g., radio buttons, checkboxes).
 * @param {string|string[]} answerData - The value of the radio buttons or checkboxes.
 * @param {string} option - The value of the option to check.
 * @returns {boolean} true if the option is selected, false otherwise.
 */
export const isChecked = (answerData, option) => {
  return typeof answerData === 'string'
    ? !!answerData && answerData === option
    : !!answerData && answerData.includes(option);
};

/**
 * Generates an array of objects with the properties value, text, conditional, hint, checked and selected.
 * @param {string} userAnswers - The current data to be used for conditional logic.
 * @param {object[]} definedAnswers - An array of objects containing the value, text, hint and conditional properties for each option.
 * @returns {object[]} - An array of objects with the properties value, text, conditional, hint, checked and selected.
 */
export const generateAnswers = (userAnswers, definedAnswers) => {
  if (!definedAnswers) {
    return [];
  }
  return definedAnswers?.map((answer) => {
    const { value, hint, text, conditional } = answer;

    if (value === 'divider') {
      return { divider: 'or' };
    }

    if (!answer.text) {
      return {
        value,
        text: value,
        hint,
        checked: isChecked(userAnswers, value),
        selected: userAnswers === value
      };
    }

    return {
      value,
      text,
      conditional,
      hint,
      checked: isChecked(userAnswers, value),
      selected: userAnswers === value
    };
  });
};

/**
 * Generates the options to be passed to the GOV.UK radiobuttons component.
 * @param {object} userAnswers - The current data to be used for conditional logic.
 * @param {string} currentPageId - The ID of the current page
 * @param {object} inputOptions - The state meta object, with properties like "title", "hint", "answers" and "classes"
 * @returns {object} The options to be passed to the GOV.UK radiobuttons component.
 */
export const generateInputOptions = (userAnswers, currentPageId, inputOptions) => {
  const { title, hint, answers, classes = 'govuk-fieldset__legend--l' } = inputOptions;
  const options = {
    classes,
    id: currentPageId,
    name: currentPageId,
    hint,
    fieldset: {
      legend: {
        text: title,
        isPageHeading: true,
        classes
      }
    },
    items: generateAnswers(userAnswers, answers)
  };

  return options;
};

/**
 * Generates an object with options for the given question, accommodating different selectable option types.
 * @param {object} userAnswers - Data provided by the user so far
 * @param {object} questionConfig - Configuration for transitions and metadata
 * @param {string} questionConfig.questionType - The type of question
 * @param {string} questionConfig.currentPageId - The ID of the current page
 * @param {object} questionConfig.inputOptions - The input options
 * @returns {object} An object with options for the given question
 */
export const generateOptions = (userAnswers, { questionType, currentPageId, inputOptions }) => {
  switch (questionType) {
    case 'checkbox':
      return generateInputOptions(userAnswers, currentPageId, inputOptions);
    case 'radio': // Add specific cases as needed
      return generateInputOptions(userAnswers, currentPageId, inputOptions);
    default:
      return undefined; // Explicitly return undefined for unhandled types
  }
};

/**
 * This is a temporary solution until session management is implemented.
 * Generates a confirmation ID as a string, in the format "XX-XXX-XXX".
 * The first two characters are random uppercase letters, and the remaining characters are random digits.
 * The ID is intended to be unique for each individual's submission.
 * @returns {string} The confirmation ID as a string.
 */
export const generateConfirmationId = () => {
  const ASCII_UPPERCASE_A = 65;
  const ALPHABET_LENGTH = 26;
  /**
   * Generates a random uppercase letter from A to Z.
   * @returns {string} A random uppercase letter.
   */
  const randomChar = () =>
    String.fromCharCode(ASCII_UPPERCASE_A + (crypto.randomBytes(1)[0] % ALPHABET_LENGTH));
  /**
   * Generates a random number between 0 and 9.
   * @returns {number} A random number between 0 and 9.
   */
  const randomDigit = () => crypto.randomBytes(1)[0] % 10;
  return `${randomChar()}${randomChar()}-${randomDigit()}${randomDigit()}${randomDigit()}-${randomDigit()}${randomDigit()}${randomDigit()}`;
};

/**
 * Checks if the given page has any errors.
 * @param {object} errors - Error state
 * @param {string} pageId - Page ID
 * @returns {boolean} If the page has errors
 */
export const hasPageErrors = (errors, pageId) =>
  Boolean(errors?.[pageId] && Object.keys(errors[pageId]).length > 0);
