import { interpret, State } from 'xstate';
import { grantTypeToMachineMap } from './index.js';

export const sessionKey = 'machineState';

/**
 * Retrieve or initialize the state machine for the given grant type in the given request.
 * @param {import('@hapi/hapi').Request} request - The Hapi request object.
 * @param {string} grantType - The grant type for this machine.
 * @returns {import('xstate').Interpreter<any, any, any>} - The initialized interpreter instance.
 */
export const initializeMachine = (request, grantType) => {
  const storedState = request.yar.get(sessionKey);

  if (!storedState) {
    console.warn(
      `No state found in session for grantType: "${grantType}". Initializing new machine.`
    );
    const newService = createAndStartGrantMachineService(grantType);
    request.yar.set(sessionKey, newService.state);
    return newService;
  }

  console.debug(`Rehydrating state for grantType: "${grantType}"`);
  const rehydratedState = State.create(storedState);
  const service = createAndStartGrantMachineService(grantType, rehydratedState);

  return service;
};

/**
 * Creates and starts an XState interpreter for the given grant type, optionally with an initial state.
 * @param {string} grantType - The grant type for this machine.
 * @param {import('xstate').State<any, any> | undefined} initialState - Optional initial state for rehydration.
 * @returns {import('xstate').Interpreter<any, any, any>} - The initialized interpreter instance.
 */
export const createAndStartGrantMachineService = (grantType, initialState) => {
  const grantConfig = grantTypeToMachineMap[grantType];

  if (!grantConfig) {
    throw new Error(`Invalid grantType: "${grantType}"`);
  }

  const { machine, actions, guards } = grantConfig;

  const service = interpret(
    machine.withConfig({
      actions,
      guards
    })
  );

  if (initialState) {
    service.start(initialState);
    console.info(`Service started with rehydrated state for grantType: "${grantType}".`);
  } else {
    service.start();
    console.info(`New service initialized for grantType: "${grantType}".`);
  }

  service.onTransition((state) => logStateTransition(state));

  return service;
};

/**
 * Logs detailed information about state transitions.
 * @param {import('xstate').State<any, any>} state - The current state object after a transition.
 */
const logStateTransition = (state) => {
  if (state.changed) {
    console.log('[State Transition]', {
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
};
