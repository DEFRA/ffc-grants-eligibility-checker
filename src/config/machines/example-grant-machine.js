import { assign, createMachine, interpret } from 'xstate';
import { pageUIConfig } from './page-ui-config.js';

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
  /**
   * Logs a message when a page is loaded
   * @param {object} context machine context
   */
  loadPageAction: (context) => {
    console.log(`${context.currentPageId} page loaded. State should reset in 1 second.`);
  },
  resetState: assign({
    /**
     * Resets the current page id.
     * Sets the currentPageId to 'start'
     * @param {object} _context - The machine context.
     * @param {object} _event - The triggered event.
     * @returns {string} The start page id.
     */
    currentPageId: (_context, _event) => {
      return 'start';
    },

    /**
     * Resets the completed page ids array
     * @param {object} _context machine context
     * @param {object} _event triggered event
     * @returns {string} empty completed page ids array
     */
    completedPageIds: (_context, _event) => {
      return [];
    },

    /**
     * Resets the user answers object.
     * Sets the user answers to an empty object.
     * @param {object} _context machine context
     * @param {object} _event triggered event
     * @returns {object} empty user answers object
     */
    userAnswers: (_context, _event) => {
      return {};
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
  })
};

export const exampleGrantMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RgB4EMC2AHANmA4gE5oB2ALgLJoDGAFgJYlgB0sZahZAxAHICiADQAqAbQAMAXUSgsAe1j0y9WSWkgUiABwB2AGzMAnLrGbNYgKwBGTec0AmADQgAnogDMBgCzM7lu3bdfO3NPCwMAX3CnVExcAmJyKjpGFmpZAFdyQmcuACEAQQBhAGlxKSQQOQUlFTUNBB1tZk9LMTEDAztdS08WgydXBCt9VstzczFtc38DKcjo9Gw8IlJKGgYmZjTMsmzeQVFJNSrFZVUK+p19IxMzKxt7Aa1LZkC7A0s3TwMbHrdLebgRZxFaJdYpVhgNIkCAAWgAjuk4DUSHkiqUjhUTii6ogAt4fpY9IE3MYiV4nghgi9Jp5NLpxm56dpTICYkt4qskhsWLAoSo4YjkWd9sIysd5Kdahc8V9DJoiboSWTtBSXIhQnYfAYme8xG43NpDQZzGzgcsEmtkpsAGaMNA4LgoNhoMgsNA2t2EAAUrTaAEouOyQZbuRC7SQHeKsZKcTKELpdFrxj9hobpuY3JTPB5mPYlaq7HSvETIlEQCRZBA4GpgxaueCmBLqmdcQhYbpKR3mG1e33+9ozbF62Drbz2Jxm1LzqB6iy3K8xhYDUnjNptNmmc0dbpZknfFchxzQVaeVsMllBjJY63460Ps1zCaGaEjLoFZS7KrF0qOiEQu0R4hg2Y6QtCgpImwt7Xi20qzhqjjqggfjmHmJpEtovReEmYieEBI6nuG9o4FOcbwQgOYGM0Zg5nY9KaP8VjZmMPYsqmtyeNoYhKmW4RAA */
  id: 'exampleGrantMachine',
  predictableActionArguments: true,
  initial: 'start',
  context: {
    previousPageId: null, // Tracks previous page
    currentPageId: 'start', // Tracks current page
    userAnswers: {}, // Store answers here
    completedPageIds: [] // Store completed pages here
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
        grantTypeId: 'example-grant'
      }
    },

    country: {
      on: {
        BACK: {
          target: 'start',
          actions: ['updateCurrentPageId']
        },

        NEXT: {
          target: 'consent', // NOSONAR:S1192 - need to improve this later
          actions: ['trackPageCompletion', 'updateCurrentPageId', 'updateAnswers']
        }
      },

      meta: {
        templateId: 'page',
        currentPageId: 'country',
        previousPageId: 'start',
        nextPageId: 'consent', // NOSONAR:S1192 - need to improve this later
        questionType: 'radio',
        answers: [
          {
            key: 'country-A1',
            value: 'Yes'
          },
          {
            key: 'country-A2',
            value: 'No'
          }
        ],
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
        answers: [
          {
            key: 'consent-A1',
            value: 'CONSENT_OPTIONAL',
            text: '(Optional) I consent to being contacted by Defra or a third party about service improvements'
          }
        ],
        ...pageUIConfig.consent
      }
    },

    confirmation: {
      entry: 'loadPageAction',
      after: {
        1000: {
          target: 'start', // Automatically transitions to 'start' after 1 second
          actions: ['resetState']
        }
      },
      meta: {
        templateId: 'confirmation',
        currentPageId: 'confirmation',
        ...pageUIConfig.confirmation
      }
    }
  }
});

// Server-side interpreter
export const exampleGrantMachineService = interpret(
  exampleGrantMachine.withConfig({
    actions: actionImplementations
  })
).onTransition((state) => {
  // istanbul ignore next
  if (state.changed) {
    console.log('State Update:', {
      currentState: state.value,
      currentContext: {
        currentPageId: state.context.currentPageId,
        completedPageIds: state.context.completedPageIds
      },
      event: state._event.name,
      history: state.history
        ? {
            previousState: state.history.value,
            previousContext: state.history.context
          }
        : 'No history available'
    });
  }
});
