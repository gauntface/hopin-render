const path = require('path');
const { test } = require('ava');

const { generateTemplateBundle } = require('../../build/factory/generateTemplateBundle');

test('generateTemplateBundle example', async (t) => {
  const relativePath = path.join(__dirname, '..', '..', 'test-assets', 'sub-template');
  const publicDir = path.join(relativePath, 'public');
  const partialsDir = path.join(relativePath, 'partials');
  const contentBundle = await generateTemplateBundle(
    path.join(relativePath, 'content.tmpl'),
    [],
    {
      hello: 'content',
    },
    {
      partialsDir,
      publicDir,
    }
  );
  const templateBundle = await generateTemplateBundle(
    path.join(relativePath, 'view.tmpl'),
    [
      contentBundle,
    ],
    {
      hello: 'view',
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
  t.deepEqual(templateBundle.styles.raw, new Set([
    'body { background-color: #2ecc71; }'
  ]));
  t.deepEqual(templateBundle.styles.inline, new Set([
    'styles/inline-1.css',
  ]));
  t.deepEqual(templateBundle.styles.sync, new Set([
    '/styles/sync-1.css',
  ]));
  t.deepEqual(templateBundle.styles.async, new Set([
    '/styles/async-1.css',
  ]));
  t.deepEqual(templateBundle.scripts.raw, new Set([
    'console.log(\'Hello from raw script.\');'
  ]));
  t.deepEqual(templateBundle.scripts.inline, new Set([
    'scripts/inline-1.js',
  ]));
  t.deepEqual(templateBundle.scripts.sync, new Set([
    '/scripts/sync-1.js',
  ]));
  t.deepEqual(templateBundle.scripts.async, new Set([
    '/scripts/async-1.js',
  ]));

  t.true(templateBundle.partialBundles.length === 1);

  const partial1Bundle = templateBundle.partialBundles[0];
  t.deepEqual(partial1Bundle.mustacheString, 'contents::partials/partial-1. {{> /partial-2.tmpl}} {{ data.hello }}');
  t.deepEqual(partial1Bundle.styles.raw, new Set([
    'body { background-color: #3498db; }'
  ]));
  t.deepEqual(partial1Bundle.styles.inline, new Set([
    'styles/inline-2.css',
  ]));
  t.deepEqual(partial1Bundle.styles.sync, new Set([
    '/styles/sync-2.css',
  ]));
  t.deepEqual(partial1Bundle.styles.async, new Set([
    '/styles/async-2.css',
  ]));
  t.deepEqual(partial1Bundle.scripts.raw, new Set([
    'console.log(\'Hello from partial-1 raw script.\');'
  ]));
  t.deepEqual(partial1Bundle.scripts.inline, new Set([
    'scripts/inline-2.js',
  ]));
  t.deepEqual(partial1Bundle.scripts.sync, new Set([
    '/scripts/sync-2.js',
  ]));
  t.deepEqual(partial1Bundle.scripts.async, new Set([
    '/scripts/async-2.js',
  ]));

  t.true(partial1Bundle.partialBundles.length === 1);

  const partial2Bundle = partial1Bundle.partialBundles[0];
  t.deepEqual(partial2Bundle.mustacheString, 'contents::partials/partial-2. {{ data.hello }}');
  t.deepEqual(partial2Bundle.styles.raw, new Set([
    'body { background-color: #9b59b6; }'
  ]));
  t.deepEqual(partial2Bundle.styles.inline, new Set([
    'styles/inline-3.css',
  ]));
  t.deepEqual(partial2Bundle.styles.sync, new Set([
    '/styles/sync-3.css',
  ]));
  t.deepEqual(partial2Bundle.styles.async, new Set([
    '/styles/async-3.css',
  ]));
  t.deepEqual(partial2Bundle.scripts.raw, new Set([
    'console.log(\'Hello from partial-2 raw script.\');'
  ]));
  t.deepEqual(partial2Bundle.scripts.inline, new Set([
    'scripts/inline-3.js',
  ]));
  t.deepEqual(partial2Bundle.scripts.sync, new Set([
    '/scripts/sync-3.js',
  ]));
  t.deepEqual(partial2Bundle.scripts.async, new Set([
    '/scripts/async-3.js',
  ]));

  t.true(templateBundle.contentBundles.length === 1);
  t.true(templateBundle.contentBundles[0] === contentBundle);
});
