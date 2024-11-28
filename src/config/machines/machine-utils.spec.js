import { jest, describe, it, expect } from '@jest/globals';
import { initializeMachine, createAndStartGrantMachineService } from './machine-utils.js';

const mockRequest = {
  yar: {
    get: jest.fn(), // Mock get method
    set: jest.fn() // Mock set method
  }
};

describe('initializeMachine', () => {
  it('should initialize a new machine when no state is in session', () => {
    // Mock the `interpret` function to return the mocked service
    mockRequest.yar.get.mockReturnValueOnce(undefined);

    const grantType = 'example-grant';
    const service = initializeMachine(mockRequest, grantType);

    expect(mockRequest.yar.set).toHaveBeenCalledWith('machineState', service.getSnapshot());
    expect(service).toBeDefined();
  });

  it('should rehydrate the machine state from session if state exists', () => {
    const storedState = {
      value: 'country',
      _event: {
        name: 'NEXT', // Event name that triggered the transition
        data: {},
        type: 'xstate.event' // Internal XState marker for the event type
      }
    }; // Mock stored state
    mockRequest.yar.get.mockReturnValueOnce(storedState);

    const grantType = 'example-grant';
    const service = initializeMachine(mockRequest, grantType);

    expect(mockRequest.yar.set).not.toHaveBeenCalled();
    expect(service).toBeDefined();
  });
});

describe('createAndStartGrantMachineService', () => {
  it('should throw an error if the grantType is invalid', () => {
    const invalidGrantType = 'invalidGrant';

    expect(() => {
      createAndStartGrantMachineService(invalidGrantType);
    }).toThrow('Invalid grantType: "invalidGrant"');
  });

  it('should return service for the given grantType in initial state', () => {
    const grantType = 'example-grant';
    const service = createAndStartGrantMachineService(grantType);

    expect(service).toBeDefined();
    service.send({ type: 'NEXT' });
    expect(service.getSnapshot().context.completedPageIds).toContain('start');
  });

  it('should rehydrate the machine service from cached state', () => {
    const grantType = 'example-grant';
    const cachedState = {
      value: 'country',
      context: {
        currentPageId: 'country',
        completedPageIds: ['start']
      },
      _event: {
        name: 'NEXT', // Event name that triggered the transition
        data: {},
        type: 'xstate.event' // Internal XState marker for the event type
      }
    };
    const service = createAndStartGrantMachineService(grantType, cachedState);

    expect(service).toBeDefined();
    service.send({ type: 'NEXT' });
    expect(service.getSnapshot().context.completedPageIds).toEqual(['start', 'country']);
  });
});
