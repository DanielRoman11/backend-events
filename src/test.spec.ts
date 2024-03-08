import * as dotenv from 'dotenv';
import * as path from 'path';
import { cwd } from 'process';

const pathEnv = path.join(cwd(), `${process.env.NODE_ENV.trim()}.env`).replaceAll('\\','/')
// console.log(pathEnv);
dotenv.config({ path: pathEnv });
dotenv.configDotenv({ path: pathEnv });
console.log(dotenv.config({path: pathEnv}));

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
