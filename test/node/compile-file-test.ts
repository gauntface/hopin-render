import {test} from 'ava';
import * as sinon from 'sinon';
import * as path from 'path';
import {compileFile, compile} from '../../src/node/index';

test.beforeEach((t) => {
  t.context.sandbox = sinon.sandbox.create();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

test('should throw for a non-existant file', async (t) => {
  await t.throws(compileFile('./test/static/non-existant-file.tmpl'));
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

