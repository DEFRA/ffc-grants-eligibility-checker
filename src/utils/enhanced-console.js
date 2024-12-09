/**
 * Replace console methods with ones that prefix the output with the current ISO timestamp.
 * This is useful for debugging and logging purposes.
 * @example
 * enhanceConsoleWithTimestamp();
 * console.log('Hello World');
 * // Output: [2022-01-01T12:00:00.000Z] Hello World
 */
export function enhanceConsoleWithTimestamp() {
  const methods = ['log', 'warn', 'error', 'info', 'debug', 'trace'];

  methods.forEach((method) => {
    const originalMethod = console[method];
    /**
     * Prefixes the output with the current ISO timestamp.
     * @param {...any} args - The arguments to be passed to the original console method.
     */
    console[method] = (...args) => {
      const timestamp = new Date().toISOString();
      originalMethod(`[${timestamp}]`, ...args);
    };
  });
}
