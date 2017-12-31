const path = require('path');
const { test } = require('ava');

const { generateTemplateBundle } = require('../../build/factory/generateTemplateBundle');
const { flattenTemplateBundle } = require('../../build/utils/flattenTemplateBundle');

test('flattenTemplateBundle example', async (t) => {
  const relativePath = path.join(__dirname, '..', '..', 'test-assets', 'sub-template');
  const publicDir = path.join(relativePath, 'public');
  const partialsDir = path.join(relativePath, 'partials');
  const contentBundle = await generateTemplateBundle(
    path.join(relativePath, 'content-1.tmpl'),
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
      hello: 'world',
    },
    {
      partialsDir,
      publicDir,
    }
  );
  const flatBundle = await flattenTemplateBundle(templateBundle, {
    partialsDir,
    publicDir,
    revisionAssets: true,
  });

  t.deepEqual(flatBundle.mustacheString, `{{#styles.raw}}
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
  t.deepEqual(flatBundle.styles.raw, [
    'body { background-color: #2ecc71; }',
    'body { background-color: #3498db; }',
    'body { background-color: #9b59b6; }',
    'body { background-color: #c0ffee; }',
  ]);
  t.deepEqual(flatBundle.styles.inline, [
    'styles/inline-1.css',
    'styles/inline-2.css',
    'styles/inline-3.css',
    'styles/content-inline-1.css',
  ]);
  t.deepEqual(flatBundle.styles.sync, [
    '/styles/sync-1.css',
    '/styles/sync-2.css',
    '/styles/sync-3.css',
    '/styles/content-sync-1.css',
  ]);
  t.deepEqual(flatBundle.styles.async, [
    '/styles/async-1.css',
    '/styles/async-2.css',
    '/styles/async-3.css',
    '/styles/content-async-1.css',
  ]);
  t.deepEqual(flatBundle.scripts.raw, [
    'console.log(\'Hello from raw script.\');',
    'console.log(\'Hello from partial-1 raw script.\');',
    'console.log(\'Hello from partial-2 raw script.\');',
    'console.log(\'Hello from content script.\');',
  ]);
  t.deepEqual(flatBundle.scripts.inline, [
    'scripts/inline-1.js',
    'scripts/inline-2.js',
    'scripts/inline-3.js',
    'scripts/content-inline-1.js',
  ]);
  t.deepEqual(flatBundle.scripts.sync, [
    '/scripts/sync-1.js',
    '/scripts/sync-2.js',
    '/scripts/sync-3.js',
    '/scripts/content-sync-1.js',
  ]);
  t.deepEqual(flatBundle.scripts.async, [
    '/scripts/async-1.js',
    '/scripts/async-2.js',
    '/scripts/async-3.js',
    '/scripts/content-async-1.js',
  ]);

  t.deepEqual(flatBundle.partialMustacheStrings, {
    'partials/partial-1.tmpl': 'contents::partials/partial-1. {{> /partial-2.tmpl}} {{ data.hello }}',
    '/partial-2.tmpl': 'contents::partials/partial-2. {{ data.hello }}',
  });

  t.deepEqual(flatBundle.contentStrings, [
    `contents::content-1. contents::partials/partial-1. contents::partials/partial-2. content content content`,
  ]);
});
