const path = require('path');
const { test } = require('ava');

const { generateTemplateBundle } = require('../../build/factory/generateTemplateBundle');
const { renderTemplateBundle } = require('../../build/factory/renderTemplateBundle');

test('renderTemplateBundle example', async (t) => {
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
  const data = {
    hello: 'world',
  };
  const render = await renderTemplateBundle(templateBundle, data);
  t.deepEqual(render, `body { background-color: #2ecc71; }
body { background-color: #3498db; }
body { background-color: #9b59b6; }
styles/inline-1.css
styles/inline-2.css
styles/inline-3.css
/styles/sync-1.css
/styles/sync-2.css
/styles/sync-3.css
/styles/async-1.css
/styles/async-2.css
/styles/async-3.css
console.log('Hello from raw script.');
console.log('Hello from partial-1 raw script.');
console.log('Hello from partial-2 raw script.');
scripts/inline-1.js
scripts/inline-2.js
scripts/inline-3.js
/scripts/sync-1.js
/scripts/sync-2.js
/scripts/sync-3.js
/scripts/async-1.js
/scripts/async-2.js
/scripts/async-3.js
contents::view-example-1. contents::partials/partial-1. contents::partials/partial-2.\u0020\u0020\u0020
Hello`);
});
