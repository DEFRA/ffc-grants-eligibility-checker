import { curry } from './curry';

describe('curry', () => {
  it('should curry a function and enable partial application of arguments', () => {
    const addThreeNumbers = (a, b, c) => a + b + c;
    const curriedAddThreeNumbers = curry(addThreeNumbers);

    expect(curriedAddThreeNumbers(1)(2)(3)).toEqual(6);
  });

  it('should call the original function immediately if all arguments are provided', () => {
    const multiplyTwoNumbers = (a, b) => a * b;
    const curriedMultiplyTwoNumbers = curry(multiplyTwoNumbers);

    expect(curriedMultiplyTwoNumbers(2, 3)).toEqual(6);
  });

  it('should return a curried function if not all arguments are provided', () => {
    const subtractThreeNumbers = (a, b, c) => a - b - c;
    const curriedSubtractThreeNumbers = curry(subtractThreeNumbers);

    const partiallyApplied = curriedSubtractThreeNumbers(10);
    expect(typeof partiallyApplied).toEqual('function');
  });
});
