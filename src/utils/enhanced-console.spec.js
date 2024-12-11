import { jest, beforeEach, afterEach, describe, it, expect } from '@jest/globals';
import { enhanceConsoleWithTimestamp } from './enhanced-console.js';

// Utility to mock console methods
function mockConsoleMethods() {
  const originalConsole = { ...console };
  const mockMethods = {};

  Object.keys(console).forEach((method) => {
    if (typeof console[method] === 'function') {
      mockMethods[method] = jest.fn();
      console[method] = mockMethods[method];
    }
  });

  return { originalConsole, mockMethods };
}

// Restore original console methods
function restoreConsoleMethods(originalConsole) {
  Object.assign(console, originalConsole);
}

describe('enhanceConsoleWithTimestamp', () => {
  let originalConsole;
  let mockMethods;
  beforeEach(() => {
    jest.clearAllMocks();
    ({ originalConsole, mockMethods } = mockConsoleMethods());
    enhanceConsoleWithTimestamp();
  });

  afterEach(() => {
    restoreConsoleMethods(originalConsole);
  });

  it.each(['log', 'warn', 'error', 'info', 'debug', 'trace'])(
    'should prefix console.%s output with ISO timestamp',
    (method) => {
      const message = 'Test message';
      const additionalData = { key: 'value' };

      // Call the enhanced console method
      console[method](message, additionalData);

      // Verify the mock console method was called
      expect(mockMethods[method]).toHaveBeenCalledTimes(1);

      // Retrieve the arguments passed to the mock method
      const callArgs = mockMethods[method].mock.calls[0];

      // Assert the first argument is an ISO timestamp
      expect(callArgs[0]).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]$/);

      // Assert the subsequent arguments are passed correctly
      expect(callArgs.slice(1)).toEqual(['Test message', { key: 'value' }]);
    }
  );

  it('should correctly replace and restore console methods', () => {
    // Verify that the console methods have been enhanced
    expect(console.log).not.toBe(originalConsole.log);
    expect(console.warn).not.toBe(originalConsole.warn);

    // Restore methods manually
    Object.entries(originalConsole).forEach(([method, original]) => {
      console[method] = original;
    });

    // Verify that the methods have been restored to their original versions
    expect(console.log).toBe(originalConsole.log);
    expect(console.warn).toBe(originalConsole.warn);
  });
});
