import {test} from 'ava';
import * as sinon from 'sinon';
import * as path from 'path';
import {compileFile, compile} from '../../src/node/index';
import { logger } from '../../src/node/utils/logger';

test.beforeEach((t) => {
  t.context.sandbox = sinon.sandbox.create();
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
  t.deepEqual(result, `Hello   Fin.
`);
});

test('should compile basic file with data', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-data.tmpl'));
  const result = await template.render({
    name: 'World',
  });
  t.deepEqual(result, `Hello World  Fin.
`);
});

test('should compile basic yaml file', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-yaml.tmpl'));
  const result = await template.render();
  t.deepEqual(result, ``);
});

test('should compile basic yaml file and print yaml data', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-yaml-print.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `I am an example
`);
});

test('should compile basic partials file', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-partials.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `hello from partial import
`);
});

test('should compile basic file with styles', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/basic-styles.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `
/* Inline CSS */



`);
});

