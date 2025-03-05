import { assign, createMachine } from 'xstate';
import { pageGlobals, pageUIConfig } from './page-ui-config.js';
import { handleSubmission } from '../../notification/handle-submission.js';

export const actionImplementations = {
  trackPageCompletion: assign({
    /**
     * Updates the completed pages
     * @param {object} context machine context
     * @param {object} _event triggered event
     * @returns {string} event's question
     */
    completedPageIds: (context, _event) => {
      return [...context.completedPageIds, context.currentPageId];
    }
  }),
  updateCurrentPageId: assign({
    /**
     * Updates the current page
     * @param {object} _context machine context
     * @param {object} event triggered event
     * @returns {string} event's question
     */
    currentPageId: (_context, event) => {
      return event.type === 'NEXT' ? event.nextPageId : event.previousPageId;
    }
  }),
  updateAnswers: assign({
    /**
     * Updates the completed pages
     * @param {object} context machine context
     * @param {object} event triggered event
     * @returns {string} event's question
     */
    userAnswers: (context, event) => {
      return {
        ...context.userAnswers,
        [event.currentPageId]: event.answer
      };
    }
  }),
  setPageErrors: assign({
    /**
     * Updates the validation errors
     * @param {object} context machine context
     * @param {object} event triggered event
     * @returns {string} event's question
     */
    pageErrors: (context, event) => {
      return {
        ...context.pageErrors,
        [event.currentPageId]: {
          key: `${event.currentPageId}Required`,
          message: 'Select an option'
        }
      };
    }
  }),
  clearPageErrors: assign({
    /**
     * Clears the validation errors for page
     * @param {object} context machine context
     * @param {object} event triggered event
     * @returns {string} event's question
     */
    pageErrors: (context, event) => {
      const newPageErrors = { ...context.pageErrors };
      delete newPageErrors[event.currentPageId];
      return newPageErrors;
    }
  })
};

export const guardsImplementations = {
  /**
   * Checks if the input for the current page is valid by ensuring all required fields have values.
   * @param {object} _context - The machine context containing the current page ID and user answers.
   * @param {object} event - The triggered event (not used for validation).
   * @returns {boolean} True if all required fields for the current page have values, false otherwise.
   */
  isRadioAnswerValid: (_context, event) => event.answer !== null
};

export const servicesImplementations = {
  /**
   * Handles a submission by formatting it into an email and sending it.
   * @param {object} context - The machine context containing the user's answers, completed page IDs, and page errors.
   * @returns {Promise<boolean>} - true if the email is sent successfully, false if not.
   */
  handleSubmission: (context) => handleSubmission(context)
};

export const exampleGrantMachine = createMachine({
  // eslint-disable-next-line jsdoc/check-tag-names
  /** @xstate-layout N4IgpgJg5mDOIC5RgB4EMC2AHANmA4gE5oB2ALgLJoDGAFgJYlgB0sZahZAxAHICiADQAqAbQAMAXUSgsAe1j0y9WSWkgUiABwBmAIzMATHoDsAFjFjdF4wFYAbABoQAT0SnTx5qYO7Nd07o2egCcdpoAvuFOqJi4BMTkVHSMLNSyAK7khM5cAEIAggDCANLiUkggcgpKKmoaCJrBwcza9sZNoQYB2k6uCPbNBsG6djaB2mLawY2R0ejYeESklDQMTMxpmWTZvIKikmpVisqqFfU6+ka6ZhZWYraOLlr62gZDutqm02OmerPg8ziS0SqxSGwyWRy-GEIl05Rk8mOtTOiF0Vk0XjEdgMdjsaKxU16iCMBkMxjEmiG-mCvxsQ3+MQW8WWSTWqRUsDA5DyRVKBwqRxqp1A9RGzU0xmMdluHgMmhsQSJCAmpkMNJxIQ+ulMNgZgMWCRWyXWaRInO50P28MqiKFdVRdnFkullll8sVTwQ7lJulCIx0n00Vl0etiBpZoJNKgAZvRCBg0EKuCg2ImWGho2QwIQABR3MQASi4jKBhtZYNNsfjiZOZUOtpO9v6wU8Ops5O0mnuNiDxiVHjELW1dm0o7RphHBkiURAJFkEDgahL4ZBxrA9eqjZRCAAtI8+jubMx5Y1zGFjAYbB53KGmcCjWzWOxOBukcL1IhjNpPDZpsE5S6oQeP2wzMI6rT+GIl4fN+uozsuzKro+myQq+drbmiPbMME3a4miLa6Eqo6knS0p6O2IRNNot6lhGa7gmaXJkGhW4im4BhKoEpJfB0nwjq0tg0SuD4VjGcYJuhCKbsibHKmYLSUl2YhXvhkr9mEhiaH41xotieJ2NO4RAA */
  id: 'exampleGrantMachine',
  predictableActionArguments: true,
  initial: 'start',
  context: {
    previousPageId: null, // Tracks previous page
    currentPageId: 'start', // Tracks current page
    userAnswers: {}, // Store answers here
    completedPageIds: [], // Store completed pages here
    pageErrors: {}, // Store page errors here
    hasSubmitted: false // Flag to track if the form has been submitted
  },
  states: {
    start: {
      on: {
        NEXT: {
          target: 'country',
          actions: ['trackPageCompletion', 'updateCurrentPageId']
        }
      },
      meta: {
        templateId: 'start',
        currentPageId: 'start',
        nextPageId: 'country',
        grant: {
          // Should be created rather than hard coded
          startUrl: '/eligibility-checker/example-grant/start'
        },
        grantTypeId: 'example-grant',
        ...pageGlobals
      }
    },

    country: {
      on: {
        BACK: {
          target: 'start',
          actions: ['updateCurrentPageId', 'clearPageErrors']
        },

        NEXT: [
          {
            cond: 'isRadioAnswerValid',
            target: 'consent', // NOSONAR:S1192 - need to improve this later
            actions: [
              'trackPageCompletion',
              'updateCurrentPageId',
              'updateAnswers',
              'clearPageErrors'
            ]
          },
          {
            target: 'country', // Stay in the same state if condition fails
            actions: ['setPageErrors'] // Fallback action
          }
        ]
      },

      meta: {
        templateId: 'page',
        currentPageId: 'country',
        previousPageId: 'start',
        nextPageId: 'consent', // NOSONAR:S1192 - need to improve this later
        questionType: 'radio',
        ...pageGlobals,
        ...pageUIConfig.country
      }
    },

    consent: {
      on: {
        BACK: {
          target: 'country',
          actions: ['updateCurrentPageId']
        },
        NEXT: {
          target: 'confirmation',
          actions: ['trackPageCompletion', 'updateCurrentPageId', 'updateAnswers']
        }
      },
      meta: {
        templateId: 'consent',
        currentPageId: 'consent', // NOSONAR:S1192 - need to improve this later
        previousPageId: 'country',
        nextPageId: 'confirmation',
        title: 'Confirm and send',
        questionType: 'checkbox',
        ...pageGlobals,
        ...pageUIConfig.consent
      }
    },
    confirmation: {
      initial: 'submitting',
      states: {
        submitting: {
          invoke: {
            src: 'handleSubmission',
            onDone: {
              target: 'success',
              actions: ['markSubmissionComplete']
            },
            onError: {
              // eslint-disable-next-line jsdoc/require-jsdoc
              actions: (_, event) => console.error('Submission failed:', event.data)
            }
          }
        },
        success: {
          type: 'final'
        }
      },
      meta: {
        templateId: 'confirmation',
        currentPageId: 'confirmation',
        ...pageGlobals,
        ...pageUIConfig.confirmation
      }
    }
  }
});
