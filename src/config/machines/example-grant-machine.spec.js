import { interpret } from 'xstate';
import {
  exampleGrantMachine,
  actionImplementations,
  guardsImplementations
} from './example-grant-machine';

describe('Example Grant Machine Service', () => {
  let service;

  beforeEach(() => {
    service = interpret(
      exampleGrantMachine.withConfig({
        actions: actionImplementations,
        guards: guardsImplementations
      })
    )
      .onTransition((state) => {
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
    expect(service.getSnapshot().context.completedPageIds).toContain('start');
  });

  it('should update currentPageId on updateCurrentPageId', () => {
    // Send the NEXT event to move to the "country" state
    service.send({ type: 'NEXT', nextPageId: 'country' });

    // The currentPageId should now be updated to "country"
    expect(service.getSnapshot().context.currentPageId).toBe('country');

    // Send NEXT event again to move to "consent"
    service.send({ type: 'NEXT', nextPageId: 'consent' });

    // Check that currentPageId is updated to "consent"
    expect(service.getSnapshot().context.currentPageId).toBe('consent');
  });

  it('should append page to completedPageIds with multiple transitions', () => {
    // Move through the states to test accumulation in completedPageIds
    service.send({ type: 'NEXT', nextPageId: 'country' }); // start -> country
    service.send({ type: 'NEXT', nextPageId: 'consent' }); // country -> consent

    // Check completedPageIds array to contain both "start" and "country"
    expect(service.getSnapshot().context.completedPageIds).toEqual(['start', 'country']);
  });

  it('should handle BACK event and correctly update currentPageId', () => {
    // Move forward to "second-question"
    service.send({ type: 'NEXT', nextPageId: 'country' });
    service.send({ type: 'NEXT', nextPageId: 'consent' });

    // Go back to "country"
    service.send({ type: 'BACK', previousPageId: 'country' });
    expect(service.getSnapshot().context.currentPageId).toBe('country');

    // Go back to "start"
    service.send({ type: 'BACK', previousPageId: 'start' });
    expect(service.getSnapshot().context.currentPageId).toBe('start');
  });

  it('should update userAnswers on updateAnswers', () => {
    service.send({ type: 'NEXT', nextPageId: 'country' });
    // Send event to update the answer for the "country" page
    service.send({
      type: 'NEXT',
      nextPageId: 'consent',
      answer: 'Yes',
      currentPageId: 'country'
    });

    // Check that the userAnswers have been updated with the new answer
    expect(service.getSnapshot().context.userAnswers).toEqual({
      country: 'Yes'
    });
  });

  it('should set page errors correctly when validation fails and clear when answer is given', () => {
    // Move to country page
    service.send({ type: 'NEXT', nextPageId: 'country' });

    // Send NEXT without an answer to trigger validation error
    service.send({
      type: 'NEXT',
      currentPageId: 'country',
      answer: null
    });

    // Check that pageErrors has been updated correctly
    expect(service.getSnapshot().context.pageErrors).toEqual({
      country: {
        key: 'countryRequired',
        message: 'Select an option'
      }
    });

    // Send NEXT with a valid answer
    service.send({
      type: 'NEXT',
      currentPageId: 'country',
      answer: 'UK'
    });

    // Check that the error is cleared
    expect(service.getSnapshot().context.pageErrors).toEqual({});
  });

  it('should clear page errors when navigating backward', () => {
    // Move to country page
    service.send({ type: 'NEXT', nextPageId: 'country' });

    // Send NEXT without an answer to trigger validation error
    service.send({
      type: 'NEXT',
      currentPageId: 'country',
      answer: null
    });

    // Ensure validation error is set
    expect(service.getSnapshot().context.pageErrors).toEqual({
      country: {
        key: 'countryRequired',
        message: 'Select an option'
      }
    });

    // Navigate backward
    service.send({ type: 'BACK', currentPageId: 'country', previousPageId: 'start' });

    // Check that the error is cleared
    expect(service.getSnapshot().context.pageErrors).toEqual({});
  });
});
