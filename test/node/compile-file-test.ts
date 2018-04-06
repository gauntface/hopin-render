import {test} from 'ava';
import * as sinon from 'sinon';
import * as path from 'path';
import {compileFile} from '../../src/node/index';

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

test('should compile empty file with ansplute path', async (t) => {
  const template = await compileFile(path.join(__dirname, '../static/empty-file.tmpl'));
  const result = await template.render();
  t.deepEqual(result, '');
});
