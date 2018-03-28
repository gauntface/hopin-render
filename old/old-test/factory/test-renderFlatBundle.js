const path = require('path');
const { test } = require('ava');

const { generateTemplateBundle } = require('../../build/factory/generateTemplateBundle');
const { renderFlatBundle } = require('../../build/factory/renderFlatBundle');
const { flattenTemplateBundle } = require('../../build/utils/flattenTemplateBundle');

test('renderFlatBundle example', async (t) => {
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
      contentBundle
    ],
    {
      hello: 'world',
    },
    {
      partialsDir,
      publicDir,
    }
  );
  const data = {
    hello: 'world',
  };
  const flatBundle = await flattenTemplateBundle(templateBundle, data);
  const render = await renderFlatBundle(flatBundle);
  t.deepEqual(render, `body { background-color: #2ecc71; }
body { background-color: #3498db; }
body { background-color: #9b59b6; }
body { background-color: #c0ffee; }
styles/inline-1.css
styles/inline-2.css
styles/inline-3.css
styles/content-inline-1.css
/styles/sync-1.css
/styles/sync-2.css
/styles/sync-3.css
/styles/content-sync-1.css
/styles/async-1.css
/styles/async-2.css
/styles/async-3.css
/styles/content-async-1.css
console.log('Hello from raw script.');
console.log('Hello from partial-1 raw script.');
console.log('Hello from partial-2 raw script.');
console.log('Hello from content script.');
scripts/inline-1.js
scripts/inline-2.js
scripts/inline-3.js
scripts/content-inline-1.js
/scripts/sync-1.js
/scripts/sync-2.js
/scripts/sync-3.js
/scripts/content-sync-1.js
/scripts/async-1.js
/scripts/async-2.js
/scripts/async-3.js
/scripts/content-async-1.js
contents::view-example-1. contents::partials/partial-1. contents::partials/partial-2. world world world
contents::content-1. contents::partials/partial-1. contents::partials/partial-2. content content content`);
});
