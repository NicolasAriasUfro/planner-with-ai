// Basic TypeScript Jest test to verify the setup works correctly

describe('Basic TypeScript Jest Setup', () => {
  test('should add numbers correctly', () => {
    const sum = (a: number, b: number): number => a + b;
    expect(sum(2, 3)).toBe(5);
  });

  test('should work with TypeScript types', () => {
    interface User {
      name: string;
      age: number;
    }

    const user: User = {
      name: 'Test User',
      age: 25
    };

    expect(user.name).toBe('Test User');
    expect(user.age).toBe(25);
    expect(typeof user.name).toBe('string');
    expect(typeof user.age).toBe('number');
  });

  test('should handle async functions', async () => {
    const asyncFunction = async (value: string): Promise<string> => {
      return Promise.resolve(`Hello ${value}`);
    };

    const result = await asyncFunction('World');
    expect(result).toBe('Hello World');
  });
});