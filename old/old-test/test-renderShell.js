const path = require('path');
const { test } = require('ava');

const { renderShell } = require('../build/index');

test('renderShell example', async (t) => {
  const relativePath = path.join(__dirname, '..', 'test-assets', 'sub-template');
  const publicDir = path.join(relativePath, 'public');
  const partialsDir = path.join(relativePath, 'partials');

  const render = await renderShell({
    shellPath: path.join(relativePath, 'view.tmpl'),
    data: {
      hello: 'view',
    },
    views: [
      {
        viewPath: path.join(relativePath, 'content-1.tmpl'),
        data: {
          hello: 'content-1',
        },
        views: [
          {
            viewPath: path.join(relativePath, 'content-2.tmpl'),
            data: {
              hello: 'content-2',
            },
          }
        ]
      }
    ],
    config: {
      publicDir,
      partialsDir,
      revisionAssets: true,
    }
  });

  t.deepEqual(render, `body { background-color: #2ecc71; }
body { background-color: #3498db; }
body { background-color: #9b59b6; }
body { background-color: #c0ffee; }
inline-1.css
inline-2.css
inline-3.css
content-inline-1.css
/styles/sync-1.c50ff44f.css
/styles/sync-2.67a0485e.css
/styles/sync-3.74c415ac.css
/styles/content-sync-1.css
/styles/async-1.f5877d26.css
/styles/async-2.742e9a13.css
/styles/async-3.3516e925.css
/styles/content-async-1.css
console.log('Hello from raw script.');
console.log('Hello from partial-1 raw script.');
console.log('Hello from partial-2 raw script.');
console.log('Hello from content script.');
inline-1.js
inline-2.js
inline-3.js
content-inline-1.js
/scripts/sync-1.c69170e0.js
/scripts/sync-2.2431b324.js
/scripts/sync-3.992c048c.js
/scripts/content-sync-1.js
/scripts/async-1.6929525c.js
/scripts/async-2.8ffb9dfb.js
/scripts/async-3.eab7d7d2.js
/scripts/content-async-1.js
contents::view-example-1. contents::partials/partial-1. contents::partials/partial-2. view view view
contents::content-1. contents::partials/partial-1. contents::partials/partial-2. content-1 content-1 content-1
contents::content-2. contents::partials/partial-1. contents::partials/partial-2. content-2 content-2 content-2`);
});
