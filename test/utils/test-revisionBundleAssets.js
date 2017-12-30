const path = require('path');
const { test } = require('ava');

const { generateTemplateBundle } = require('../../build/factory/generateTemplateBundle');
const { flattenTemplateBundle } = require('../../build/utils/flattenTemplateBundle');
const { revisionBundleAssets } = require('../../build/utils/revisionBundleAssets');

test('revisionBundleAssets example', async (t) => {
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
  const flatBundle = await flattenTemplateBundle(templateBundle);
  const revisionedBundle = await revisionBundleAssets(flatBundle, {
    publicDir,
  });

  t.deepEqual(revisionedBundle.mustacheString, `{{#styles.raw}}
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
  t.deepEqual(revisionedBundle.styles.raw, [
    'body { background-color: #2ecc71; }',
    'body { background-color: #3498db; }',
    'body { background-color: #9b59b6; }',
  ]);
  t.deepEqual(revisionedBundle.styles.inline, [
    'styles/inline-1.css',
    'styles/inline-2.css',
    'styles/inline-3.css'
  ]);
  t.deepEqual(revisionedBundle.styles.sync, [
    '/styles/sync-1.c50ff44f.css',
    '/styles/sync-2.67a0485e.css',
    '/styles/sync-3.74c415ac.css'
  ]);
  t.deepEqual(revisionedBundle.styles.async, [
    '/styles/async-1.f5877d26.css',
    '/styles/async-2.742e9a13.css',
    '/styles/async-3.3516e925.css'
  ]);
  t.deepEqual(revisionedBundle.scripts.raw, [
    'console.log(\'Hello from raw script.\');',
    'console.log(\'Hello from partial-1 raw script.\');',
    'console.log(\'Hello from partial-2 raw script.\');',
  ]);
  t.deepEqual(revisionedBundle.scripts.inline, [
    'scripts/inline-1.js',
    'scripts/inline-2.js',
    'scripts/inline-3.js',
  ]);
  t.deepEqual(revisionedBundle.scripts.sync, [
    '/scripts/sync-1.c69170e0.js',
    '/scripts/sync-2.2431b324.js',
    '/scripts/sync-3.992c048c.js',
  ]);
  t.deepEqual(revisionedBundle.scripts.async, [
    '/scripts/async-1.6929525c.js',
    '/scripts/async-2.8ffb9dfb.js',
    '/scripts/async-3.eab7d7d2.js',
  ]);

  t.deepEqual(revisionedBundle.partialMustacheStrings, {
    'partials/partial-1.tmpl': 'contents::partials/partial-1. {{> /partial-2.tmpl}} {{ data.hello }}',
    '/partial-2.tmpl': 'contents::partials/partial-2. {{ data.hello }}',
  });
});
