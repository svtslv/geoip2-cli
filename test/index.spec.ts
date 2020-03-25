import * as index from '../src/index';

describe('Index', () => {
  test('should return 7 exports', () => {
    expect(Object.keys(index)).toHaveLength(7);
  });
});