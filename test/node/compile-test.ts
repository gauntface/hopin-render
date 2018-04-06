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

test('should compile template string with no data', async (t) => {
  const template = await compile('Hello {{name}} {{nonExistant}} Fin.');
  const result = await template.render();
  t.deepEqual(result, 'Hello   Fin.');
});

test('should compile template string with data', async (t) => {
  const template = await compile('Hello {{data.name}} {{data.nonExistant}} Fin.');
  const result = await template.render({
    name: 'World',
  });
  t.deepEqual(result, 'Hello World  Fin.');
});

test('should compile template with yaml', async (t) => {
  const template = await compile(`---
hello:
  world:
    - "I'm an example"
---
`);
  const result = await template.render();
  t.deepEqual(result, '');
});

test('should compile template with yaml and print', async (t) => {
  const template = await compile(`---
hello:
  world:
    - "I am an example"
---
{{yaml.hello.world}}`);
  const result = await template.render();
  t.deepEqual(result, 'I am an example');
});
