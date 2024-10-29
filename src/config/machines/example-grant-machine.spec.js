import { interpret } from 'xstate';
import { exampleGrantMachine, actionImplementations } from './example-grant-machine';

describe('Example Grant Machine Service', () => {
  let service;

  beforeEach(() => {
    service = interpret(
      exampleGrantMachine.withConfig({
        actions: actionImplementations
      })
    )
      .onTransition((state) => {
        if (state.changed) {
          console.debug('UPDATED STATE:', state);
        }
      })
      .start();
  });

  afterEach(() => {
    service.stop();
  });

  it('should be defined', () => {
    expect(exampleGrantMachine).toBeDefined();
  });

  it('should add current page ID to completedPageIds on trackPageCompletion', () => {
    // Move from start to country
    service.send({ type: 'NEXT' });

    // Check that completedPageIds contains the "start" page
    expect(service.state.context.completedPageIds).toContain('start');
  });

  it('should update currentPageId on updateCurrentPageId', () => {
    // Send the NEXT event to move to the "country" state
    service.send({ type: 'NEXT', nextPageId: 'country' });

    // The currentPageId should now be updated to "country"
    expect(service.state.context.currentPageId).toBe('country');

    // Send NEXT event again to move to "second-question"
    service.send({ type: 'NEXT', nextPageId: 'second-question' });

    // Check that currentPageId is updated to "second-question"
    expect(service.state.context.currentPageId).toBe('second-question');
  });

  it('should append page to completedPageIds with multiple transitions', () => {
    // Move through the states to test accumulation in completedPageIds
    service.send({ type: 'NEXT', nextPageId: 'country' }); // start -> country
    service.send({ type: 'NEXT', nextPageId: 'second-question' }); // country -> second-question

    // Check completedPageIds array to contain both "start" and "country"
    expect(service.state.context.completedPageIds).toEqual(['start', 'country']);
  });

  it('should handle BACK event and correctly update currentPageId', () => {
    // Move forward to "second-question"
    service.send({ type: 'NEXT', nextPageId: 'country' });
    service.send({ type: 'NEXT', nextPageId: 'second-question' });

    // Go back to "country"
    service.send({ type: 'BACK', previousPageId: 'country' });
    expect(service.state.context.currentPageId).toBe('country');

    // Go back to "start"
    service.send({ type: 'BACK', previousPageId: 'start' });
    expect(service.state.context.currentPageId).toBe('start');
  });
});
