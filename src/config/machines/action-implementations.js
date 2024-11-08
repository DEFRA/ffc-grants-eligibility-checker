import { assign } from 'xstate';

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
        [event.id]: event.answer
      };
    }
  })
};
