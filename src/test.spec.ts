import * as dotenv from 'dotenv';
dotenv.config();

test('test is null', () => {
  const n = null;

  expect(n).toBeNull();
});

test('2 + 2', () => {
  const result = 2 + 2;
  expect(result).toBe(4);
});

test(' enviromental variables are not null', () => {
  const env = process.env.DB_NAME;

  expect(env).not.toBeUndefined();
});
