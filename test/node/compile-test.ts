import {test} from 'ava';
import * as sinon from 'sinon';
import {compile} from '../../src/node/index';

test.beforeEach((t) => {
  t.context.sandbox = sinon.sandbox.create();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

test('should compile empty string', async (t) => {
  const template = await compile('');
  const result = await template.render();
  t.deepEqual(result, '');
});
