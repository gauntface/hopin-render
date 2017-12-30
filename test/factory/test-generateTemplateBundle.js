const path = require('path');
const { test } = require('ava');

const { generateTemplateBundle } = require('../../build/factory/generateTemplateBundle');

test('generateTemplateBundle example', async (t) => {
  const relativePath = path.join(__dirname, '..', '..', 'test-assets', 'sub-template');
  const publicDir = path.join(relativePath, 'public');
  const partialsDir = path.join(relativePath, 'partials');
  const viewPath = path.join(relativePath, 'view.tmpl');
  const templateBundle = await generateTemplateBundle(
    viewPath,
    [
      // TODO: Add Template Bundle Here
    ],
    {
      hello: 'world',
    },
    {
      partialsDir,
      publicDir,
    }
  );

  t.deepEqual(templateBundle.mustacheString, `{{#styles.raw}}
{{{.}}}
{{/styles.raw}}
{{#styles.inline}}
{{{.}}}
{{/styles.inline}}
{{#styles.sync}}
{{{.}}}
{{/styles.sync}}
{{#styles.async}}
{{{.}}}
{{/styles.async}}
{{#scripts.raw}}
{{{.}}}
{{/scripts.raw}}
{{#scripts.inline}}
{{{.}}}
{{/scripts.inline}}
{{#scripts.sync}}
{{{.}}}
{{/scripts.sync}}
{{#scripts.async}}
{{{.}}}
{{/scripts.async}}
contents::view-example-1. {{> partials/partial-1.tmpl}} {{ data.hello }}
{{{content}}}`);
  t.deepEqual(templateBundle.styles.raw, [
    'body { background-color: #2ecc71; }'
  ]);
  t.deepEqual(templateBundle.styles.inline, [
    'styles/inline-1.css',
  ]);
  t.deepEqual(templateBundle.styles.sync, [
    '/styles/sync-1.css',
  ]);
  t.deepEqual(templateBundle.styles.async, [
    '/styles/async-1.css',
  ]);
  t.deepEqual(templateBundle.scripts.raw, [
    'console.log(\'Hello from raw script.\');'
  ]);
  t.deepEqual(templateBundle.scripts.inline, [
    'scripts/inline-1.js',
  ]);
  t.deepEqual(templateBundle.scripts.sync, [
    '/scripts/sync-1.js',
  ]);
  t.deepEqual(templateBundle.scripts.async, [
    '/scripts/async-1.js',
  ]);

  t.true(templateBundle.partialBundles.length === 1);

  const partial1Bundle = templateBundle.partialBundles[0];
  t.deepEqual(partial1Bundle.mustacheString, 'contents::partials/partial-1. {{> /partial-2.tmpl}} {{ data.hello }}');
  t.deepEqual(partial1Bundle.styles.raw, [
    'body { background-color: #3498db; }'
  ]);
  t.deepEqual(partial1Bundle.styles.inline, [
    'styles/inline-2.css',
  ]);
  t.deepEqual(partial1Bundle.styles.sync, [
    '/styles/sync-2.css',
  ]);
  t.deepEqual(partial1Bundle.styles.async, [
    '/styles/async-2.css',
  ]);
  t.deepEqual(partial1Bundle.scripts.raw, [
    'console.log(\'Hello from partial-1 raw script.\');'
  ]);
  t.deepEqual(partial1Bundle.scripts.inline, [
    'scripts/inline-2.js',
  ]);
  t.deepEqual(partial1Bundle.scripts.sync, [
    '/scripts/sync-2.js',
  ]);
  t.deepEqual(partial1Bundle.scripts.async, [
    '/scripts/async-2.js',
  ]);

  t.true(partial1Bundle.partialBundles.length === 1);

  const partial2Bundle = partial1Bundle.partialBundles[0];
  t.deepEqual(partial2Bundle.mustacheString, 'contents::partials/partial-2. {{ data.hello }}');
  t.deepEqual(partial2Bundle.styles.raw, [
    'body { background-color: #9b59b6; }'
  ]);
  t.deepEqual(partial2Bundle.styles.inline, [
    'styles/inline-3.css',
  ]);
  t.deepEqual(partial2Bundle.styles.sync, [
    '/styles/sync-3.css',
  ]);
  t.deepEqual(partial2Bundle.styles.async, [
    '/styles/async-3.css',
  ]);
  t.deepEqual(partial2Bundle.scripts.raw, [
    'console.log(\'Hello from partial-2 raw script.\');'
  ]);
  t.deepEqual(partial2Bundle.scripts.inline, [
    'scripts/inline-3.js',
  ]);
  t.deepEqual(partial2Bundle.scripts.sync, [
    '/scripts/sync-3.js',
  ]);
  t.deepEqual(partial2Bundle.scripts.async, [
    '/scripts/async-3.js',
  ]);
});
