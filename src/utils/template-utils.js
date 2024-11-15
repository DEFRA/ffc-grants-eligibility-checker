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
 * Sets the label and other properties for each option in a set of selectable options (e.g., radio buttons, checkboxes).
 * @param {string} data - The value of the radio buttons.
 * @param {object[]} answers - An array of objects containing the value, text, hint and conditional properties for each option.
 * @returns {object[]} - An array of objects with the properties value, text, conditional, hint, checked and selected.
 */
export const setOptionsLabel = (data, answers) => {
  if (!answers) {
    return [];
  }
  return answers?.map((answer) => {
    const { value, hint, text, conditional } = answer;

    if (value === 'divider') {
      return { divider: 'or' };
    }

    if (!answer.text) {
      return {
        value,
        text: value,
        hint,
        checked: isChecked(data, value),
        selected: data === value
      };
    }

    return {
      value,
      text,
      conditional,
      hint,
      checked: isChecked(data, value),
      selected: data === value
    };
  });
};

/**
 * Returns the options configuration for a GOV.UK component with selectable options.
 * @param {object} data - The current data to be used for conditional logic.
 * @param {object} stateMeta - The state meta object containing the title, hint, yarKey, answers and classes.
 * @returns {object} The options to be passed to the GOV.UK radiobuttons component.
 */
export const inputOptions = (data, stateMeta) => {
  const {
    currentPageId,
    title,
    hint,
    sidebar,
    answers,
    classes = 'govuk-fieldset__legend--l'
  } = stateMeta;
  const options = {
    classes,
    id: currentPageId,
    hint,
    sidebar,
    name: currentPageId,
    fieldset: {
      legend: {
        text: title,
        isPageHeading: true,
        classes
      }
    },
    items: setOptionsLabel(data, answers)
  };

  return options;
};

/**
 * Returns an object with options for the given question, accommodating different selectable option types.
 * @param {object} data - Data provided by the user so far
 * @param {object} stateMeta - The state meta object, with properties like "type", "text" and "options"
 * @returns {object} An object with options for the given question
 */
export const getOptions = (data, stateMeta) => {
  switch (stateMeta.questionType) {
    case 'checkbox':
      return inputOptions(data, stateMeta);
    case 'radio': // Add specific cases as needed
      return inputOptions(data, stateMeta);
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
  /**
   * Generates a random uppercase letter from A to Z.
   * @returns {string} A random uppercase letter.
   */
  const randomChar = () => String.fromCharCode(65 + (crypto.randomBytes(1)[0] % 26));
  /**
   * Generates a random number between 0 and 9.
   * @returns {number} A random number between 0 and 9.
   */
  const randomDigit = () => crypto.randomBytes(1)[0] % 10;
  return `${randomChar()}${randomChar()}-${randomDigit()}${randomDigit()}${randomDigit()}-${randomDigit()}${randomDigit()}${randomDigit()}`;
};
