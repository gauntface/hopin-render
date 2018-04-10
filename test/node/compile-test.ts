import {test} from 'ava';
import * as sinon from 'sinon';
import * as path from 'path';
import {compile} from '../../src/node/index';
import {logger} from '../../src/node/utils/logger';

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

test.serial('should warn if partials is not an array', async (t) => {
  const loggerStub = t.context.sandbox.stub(logger, 'warn');
  const template = await compile(`---
partials:
  hello:
    world:
      - "I am an example"
---
{{yaml.partials.hello.world}}`);
  const result = await template.render();
  t.deepEqual(result, 'I am an example');
  t.deepEqual(loggerStub.callCount, 1, 'logger.warn call count');
  t.deepEqual(loggerStub.args[0][0], 'The \'partials\' yaml field should be a list of strings but found \'object\' instead.');
});

test.serial('should warn if a partials entry is not a string', async (t) => {
  const loggerStub = t.context.sandbox.stub(logger, 'warn');
  const template = await compile(`---
partials:
  - 123
  - ./test/static/partial-import.tmpl
  - hello:
      world:
        - "I am an example"
---
{{yaml.partials.[2].hello.world}}`);
  const result = await template.render();
  t.deepEqual(result, 'I am an example');
  t.deepEqual(loggerStub.callCount, 1, 'logger.warn call count');
  t.deepEqual(loggerStub.args[0][0], `Found partials that were not strings:
- 123
- {"hello":{"world":["I am an example"]}}`);
});

test('should warn if a partials entry is not a string', async (t) => {
  const partialPath = path.join(__dirname, '..', 'static', 'partial-import.tmpl');
  const template = await compile(`---
partials:
  - ${partialPath}
---
{{> "${partialPath}"}}`);
  const result = await template.render();
  t.deepEqual(result, `hello from partial import
`);
});
