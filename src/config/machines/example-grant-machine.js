import { assign, createMachine, interpret } from 'xstate';

// Define the implementations for your actions
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
        // TODO: think about removing duplication with on.NEXT.target
        nextPageId: 'country'
      }
    },

    country: {
      on: {
        BACK: {
          target: 'start',
          actions: ['updateCurrentPageId']
        },

        NEXT: {
          target: 'second-question',
          actions: ['trackPageCompletion', 'updateCurrentPageId']
        }
      },

      meta: {
        previousPageId: 'start',
        nextPageId: 'second-question'
      }
    },

    'second-question': {
      on: {
        BACK: {
          target: 'country',
          actions: ['updateCurrentPageId']
        },
        NEXT: {
          target: 'final',
          actions: ['trackPageCompletion', 'updateCurrentPageId']
        }
      },
      meta: {
        previousPageId: 'country',
        nextPageId: 'final'
      }
    },

    final: {
      entry: 'loadPageAction',
      after: {
        1000: {
          target: 'start', // Automatically transitions to 'start' after 1 second
          actions: ['resetState']
        }
      },
      meta: {
        currentPageId: 'final'
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
    console.debug('UPDATED STATE:', state);
  }
});
exampleGrantMachineService.start();
