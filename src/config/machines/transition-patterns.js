const DEFAULT_BACK_ACTIONS = ['updateCurrentPageId'];
const DEFAULT_NEXT_ACTIONS = ['trackPageCompletion', 'updateCurrentPageId', 'updateAnswers'];

/**
 * Creates standard transitions for a page in the journey
 * @param {string} backTarget - The state to go back to
 * @param {string} nextTarget - The state to go forward to
 * @param {object} options - Configuration options
 * @param {string[]} [options.backActions] - Actions to execute on BACK (defaults to ['updateCurrentPageId'])
 * @param {string[]} [options.nextActions] - Actions to execute on NEXT (defaults to ['trackPageCompletion', 'updateCurrentPageId', 'updateAnswers'])
 * @returns {object} Standard transition configuration
 */
export const createTransitions = (backTarget, nextTarget, options = {}) => ({
  on: {
    ...(backTarget && {
      BACK: {
        target: backTarget,
        actions: options.backActions || DEFAULT_BACK_ACTIONS
      }
    }),
    ...(nextTarget && {
      NEXT: {
        target: nextTarget,
        actions: options.nextActions || DEFAULT_NEXT_ACTIONS
      }
    })
  }
});
