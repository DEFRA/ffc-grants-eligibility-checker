import { compose } from "./compose";

describe("compose", () => {
  it("composes functions from right to left", () => {
    const add = (x) => x + 2;
    const multiply = (x) => x * 3;
    const combined = compose(multiply, add);

    const result = combined(2); // First adds 2 to 2, getting 4. Then multiplies 4 by 3, getting 12.

    expect(result).toBe(12);
  });

  it("handles the identity case", () => {
    const identity = (x) => x;
    const combined = compose(identity, identity);

    const result = combined(2); // Identity function should return the same value.

    expect(result).toBe(2);
  });

  it("handles no function case", () => {
    const combined = compose();

    const result = combined(2); // Without functions to compose, the initial value should be returned.

    expect(result).toBe(2);
  });
});
