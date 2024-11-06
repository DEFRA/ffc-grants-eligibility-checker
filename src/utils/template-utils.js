/**
 * Checks if a given option is selected in a set of radio buttons or checkboxes.
 * @param {string|string[]} answerData - The value of the radio buttons or checkboxes.
 * @param {string} option - The value of the option to check.
 * @returns {boolean} true if the option is selected, false otherwise.
 */
function isChecked(answerData, option) {
  return typeof answerData === 'string'
    ? !!answerData && answerData === option
    : !!answerData && answerData.includes(option);
}

/**
 * Sets the label for each option in a set of radio buttons.
 * @param {string} data - The value of the radio buttons.
 * @param {object[]} answers - An array of objects containing the value, text, hint and conditional properties for each option.
 * @param {string} conditionalHtml - The conditional HTML for each option.
 * @returns {object[]} - An array of objects with the properties value, text, conditional, hint, checked and selected.
 */
function setOptionsLabel(data, answers, conditionalHtml) {
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
}

/**
 * Returns the options for a GOV.UK radiobuttons component.
 * @param {object} data - The current data to be used for conditional logic.
 * @param {object} stateMeta - The state meta object containing the title, hint, yarKey, answers and classes.
 * @param {string} [conditionalHtml] - Any conditional HTML to be rendered.
 * @returns {object} The options to be passed to the GOV.UK radiobuttons component.
 */
const inputOptions = (data, stateMeta, conditionalHtml) => {
  const { id, title, answers, classes = 'govuk-fieldset__legend--l' } = stateMeta;
  const options = {
    classes,
    id,
    name: id,
    fieldset: {
      legend: {
        text: title,
        isPageHeading: true,
        classes
      }
    },
    items: setOptionsLabel(data, answers, conditionalHtml)
  };
  console.log(`inputOptions: ${JSON.stringify(options, null, 2)}`);
  return options;
};

/**
 * Returns an object with options for the given question.
 * @param {object} data - Data provided by the user so far
 * @param {object} stateMeta - The state meta object, with properties like "type", "text" and "options"
 * @returns {object} An object with options for the given question
 */
export const getOptions = (data, stateMeta) => {
  switch (stateMeta.questionType) {
    default:
      return inputOptions(data, stateMeta);
  }
};