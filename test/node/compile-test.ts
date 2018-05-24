import {test} from 'ava';
import * as sinon from 'sinon';
import * as path from 'path';
import {EOL} from 'os';
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

test('should throw if partials is not an array', async (t) => {
  const template = await compile(`---
partials:
  hello:
    world:
      - "I am an example"
---
{{yaml.partials.hello.world}}`);
  await t.throws(template.render());
});

test('should throw if a partials entry is not a string', async (t) => {
  const template = await compile(`---
partials:
  - 123
  - ./test/static/partial-import.tmpl
  - hello:
      world:
        - "I am an example"
---
{{yaml.partials.[2].hello.world}}`);
  await t.throws(template.render());
});

test('should work if partial is a string', async (t) => {
  const partialPath = path.join(__dirname, '..', 'static', 'partial-import.tmpl');
  const template = await compile(`---
partials:
  - ${partialPath}
---
{{> "${partialPath}"}}`);
  const result = await template.render();
  t.deepEqual(result, `hello from partial import${EOL}`);
});

test('should work if inline style file is absolute', async (t) => {
  const inlinePath = path.join(__dirname, '..', 'static', 'inline.css');
  const template = await compile(`---
styles:
  inline:
    - ${inlinePath}
---
{{#hopin.styles.inline}}
{{{.}}}
{{/hopin.styles.inline}}`);
  const result = await template.render();
  // Seems Mustache is using new line characters regardless on platform here.
  t.deepEqual(result, `/* Inline CSS */${EOL}\n`);
});

test('should handle empty styles', async (t) => {
  const template = await compile(`---
styles:
  other:
    - ./inline.css
---
Hello`);
  const result = await template.render();
  t.deepEqual(result, `Hello`);
});
