import {test} from 'ava';
import * as sinon from 'sinon';
import * as path from 'path';
import {EOL} from 'os';
import {compileFile, compile} from '../../src/node/index';
import { logger } from '../../src/node/utils/logger';

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

test.serial('should throw for a non-existant file', async (t) => {
  const loggerStub = t.context.sandbox.stub(logger, 'error');
  await t.throws(compileFile('./test/static/non-existant-file.tmpl'));
  t.deepEqual(loggerStub.callCount, 1, 'logger.error call count');
  t.deepEqual(loggerStub.args[0][0], 'Unable to access \'./test/static/non-existant-file.tmpl\'')
});

test('should compile empty file with relative path', async (t) => {
  const template = await compileFile('./test/static/empty-file.tmpl');
  const result = await template.render();
  t.deepEqual(result, '');
});

test('should compile empty file with absolute path', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/empty-file.tmpl'));
  const result = await template.render();
  t.deepEqual(result, '');
});

test('should compile basic file with no data', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-data.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `Hello   Fin.${EOL}`);
});

test('should compile basic file with data', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-data.tmpl'));
  const result = await template.render({
    name: 'World',
  });
  t.deepEqual(result, `Hello World  Fin.${EOL}`);
});

test('should compile basic yaml file', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-yaml.tmpl'));
  const result = await template.render();
  t.deepEqual(result, ``);
});

test('should compile basic yaml file and print yaml data', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-yaml-print.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `I am an example${EOL}`);
});

test('should compile basic partials file', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-partials.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `hello from partial import${EOL}`);
});

test('should compile basic file with styles', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-styles.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `/* Inline CSS */${EOL}${EOL}./sync.css${EOL}/sync.css${EOL}./async.css${EOL}/async.css${EOL}`);
});

test('should compile basic file with duplicate styles', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/duplicate-styles.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `/* Inline CSS */${EOL}\n./sync.css\n/sync.css\n./async.css\n/async.css\n`);
});

test('should compile basic file with scripts', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-scripts.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `/* Inline JS */\n\n./sync.js\n/sync.js\n./async.js\n/async.js\n`);
});

test('should compile basic file with duplicate scripts', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/duplicate-scripts.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `/* Inline JS */\n\n./sync.js\n/sync.js\n./async.js\n/async.js\n`);
});

test('should compile complete file with partials, merging styles and scripts', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/complete-partials.tmpl'));
  const result = await template.render();
  // TODO This test doesn't currently test for partial styles and scripts being added to final compilation
  // Implement next.
  t.deepEqual(result, `hello from partial import\nhello from nested partial import\n/* Inline CSS */${EOL}\n/* Inline CSS-3 */\n\n/* Inline CSS-2 */\n\n/* Inline CSS-4 */\n\n/sync.css\n/sync-3.css\n/sync-2.css\n/sync-4.css\n/async.css\n/async-3.css\n/async-2.css\n/async-4.css\n\n/* Inline JS */\n\n/* Inline JS-3 */\n\n/* Inline JS-2 */\n\n/* Inline JS-4 */\n\n/sync.js\n/sync-3.js\n/sync-2.js\n/sync-4.js\n/async.js\n/async-3.js\n/async-2.js\n/async-4.js\n`);
});