/**
 * Пример использования:
 * @example
 * invariant(truthyValue, 'This should not throw!');
 * invariant(falsyValue, 'This will throw!'); // Error('Invariant violation: This will throw!');
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function invariant(condition: any, message: string): asserts condition {
  if (condition) {
    return;
  }

  throw new Error(`Invariant violation: ${message}`);
}
