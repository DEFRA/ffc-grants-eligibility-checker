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
  })
};

export const exampleGrantMachine = createMachine({
  /** xstate-layout N4IgpgJg5mDOIC5RgB4EMC2AHANmA4gE5oB2ALgLJoDGAFgJYlgB0sZahZAxAHICiADQAqAbQAMAXUSgsAe1j0y9WSWkgUiAIwBmAKzMAbNoBMADk0GAnJbGmALA+MAaEAE8tAdgPNdH02MsvQJtdbVMAX3CXVExcAmJyKjpGFmpZDAwVAFo0gFdyQlcuACEAQQBhAGlxKSQQOQUlFTUNBB1vW1NQ2zFdMQ9jOxd3BHNmE2MbHT1NTTNI6PRsPCJSShoGJmY0jOy8gqL+YRq1BsVlVTrW3WN9A3sbLv87D2thz0tmfvNbiw8AwYRKLgJZxVaJDYpVhgNIkCBZACOuTgTRIJQq1Ukp3k52aV0QN28mjsYgMuhsxjEk3671G2mYpmM1Omulm82BMWW8TWSU2LFgMJU8KRKIuvEEoixdTOqJaiEezE0ulMpm0YW0SuJulpmg89LsljJZlMersTPukWBJFkEDgak5YIS62STGxjQucoQWQMtO9XzEAcDQcDHgWINiKydvKhbA4ZDduMuoFaZtplLshlMBiML0eoTNYYdkZ5kK2O0yJBysnyZEKCdl+IQ2hJirCVOJ2hCHg82rciEpHkVWZzr1s+eMhdBxYhLv5grhiORbA90pxDeTiD1YkVUw1zeJ9h9fYQlM+92zzdHXWbE45U+5M75zAAZow0Dh6yuN202YYDCSwmMV4Bm7NNbGYBw9wcOx7H+OxLXCIA */
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
      type: 'final',
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
  if (state.changed) {
    console.debug('UPDATED STATE:', state);
  }
});
exampleGrantMachineService.start();
