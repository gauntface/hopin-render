import {test} from 'ava';
import * as sinon from 'sinon';
import {compileFile} from '../../src/node/index';

test.beforeEach((t) => {
  t.context.sandbox = sinon.sandbox.create();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

test('should compile empty string', async (t) => {
  const template = compileFile('./test/static/empty-file.tmpl');

  const result = await template.render();
  t.deepEqual(result, '');
});
