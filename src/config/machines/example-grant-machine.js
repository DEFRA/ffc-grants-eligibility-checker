import { assign, createMachine, interpret } from "xstate";

// Define the implementations for your actions
const actionImplementations = {
  trackPageCompletion: assign({
    /**
     * Updates the completed pages
     * @param {object} context machine context
     * @param {object} event triggered event
     * @returns {string} event's question
     */
    completedPageIds: (context, event) => {
      return [...context.completedPageIds, context.currentPageId];
    },
  }),
  updateCurrentPageId: assign({
    /**
     * Updates the current page
     * @param {object} context machine context
     * @param {object} event triggered event
     * @returns {string} event's question
     */
    currentPageId: (context, event) => {
      return event.nextPageId;
    },
  }),
};

const exampleGrantMachine = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5RgB4EMC2AHANmA4gE5oB2ALgLJoDGAFgJYlgB0sZahZAxAHICiADQAqAbQAMAXUSgsAe1j0y9WSWkgUiAIwBmAKzMAbJoCcAdgAcB0wd0AWIwdsAaEAE8t2sc1vaATNs1bWzFNczFfCwBfSJdUTFwCYnIqOkYWADN6QjYAWgBHAFc4JRUuACEAQQBhAGlxKSQQOQUS1UaNBH8DZl9jX10Q7SNbHV8XdwRzTWZQ0Ls562MxXWjY9Gw8IlJKGgYmZkzssnyitmUSXkFRSTVmxXO1DttjcxnjXVNfTVMgvXNjbTjDy+ZgA-yBYKhcLmVbgdYJLbJXZpVhgagqCAnYrncrVOo3Rp3VqPRC6F7MSzmezmPwRMQ+IGTbSGKZ9Wx2UxiPS6AywuIbRLbFJ7FiwNEYrFnUr8YT1W7ye4qEmTMLMMTmMKaQLGAxU3xjNxaCLMPSadWjek-XTaaIxEAkWQQOBqfkIpI7VJMeUtB7tRA5AyMgN8+Gbd3ClFsDhkb2KtqgJ4GiaaD4Ul5U61iPrmTkwu2usNC5H7Q65QrYpWEhXEv0IbTaYzMXS6cw88y9YxmRyMzQGLwNjXszzZ0yaEPxQtIz2i8UkTHlqXxprV30JxCckE6dlciIa0xDHsGEH-QeZkdj-OhwVTkUHRhoHCxmtrhBmqlq3xWAFcnQfQ-TGws07IITH6FZbSAA */
  id: "exampleGrantMachine",
  initial: "start",
  context: {
    previousPageId: undefined, // Tracks current page
    currentPageId: "start", // Tracks current page
    userAnswers: {}, // Store answers here
    completedPageIds: [], // Store completed pages here
  },
  states: {
    start: {
      on: {
        NEXT: {
          target: "first-question",
          actions: ["trackPageCompletion", "updateCurrentPageId"],
        },
      },
      meta: {
        // TODO: think about removing duplication with on.NEXT.target
        nextPageId: "first-question",
      },
    },

    "first-question": {
      on: {
        BACK: {
          target: "start",
          actions: ["updateCurrentPageId"],
        },

        NEXT: {
          target: "second-question",
          actions: ["trackPageCompletion", "updateCurrentPageId"],
        },
      },

      meta: {
        previousPageId: "start",
        nextPageId: "second-question",
      },
    },

    "second-question": {
      on: {
        BACK: {
          target: "first-question",
          actions: ["updateCurrentPageId"],
        },
        NEXT: {
          target: "final",
          actions: ["trackPageCompletion", "updateCurrentPageId"],
        },
      },
      meta: {
        previousPageId: "first-question",
        nextPageId: "final",
      },
    },

    final: {
      type: "final",
      meta: {
        currentPageId: "final",
      },
    },
  },
});

// Server-side interpreter
export const exampleGrantMachineService = interpret(
  exampleGrantMachine.withConfig({
    actions: actionImplementations,
  }),
).onTransition((state) => {
  if (state.changed) {
    console.log("UPDATED STATE:", state);
  }
});
exampleGrantMachineService.start();
