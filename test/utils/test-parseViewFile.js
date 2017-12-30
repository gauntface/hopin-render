const path = require('path');
const { test } = require('ava');

const { parseViewFile } = require('../../build/utils/parseViewFile');

test('parseViewFile example', async (t) => {
  const relativePath = path.join(__dirname, '..', '..', 'test-assets', 'sub-template');
  const viewPath = path.join(relativePath, 'view.tmpl');
  const parsedView = await parseViewFile(
    viewPath,
  );

  t.deepEqual(parsedView.contents, `{{#styles.raw}}
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
  t.deepEqual(parsedView.yaml, {
    partials: [
      'partials/partial-1.tmpl'
    ],
    scripts: {
      raw: [
        'console.log(\'Hello from raw script.\');'
      ],
      inline: [
        'scripts/inline-1.js',
      ],
      sync: [
        '/scripts/sync-1.js',
      ],
      async: [
        '/scripts/async-1.js',
      ]
    },
    styles: {
      raw: [
        'body { background-color: #2ecc71; }'
      ],
      inline: [
        'styles/inline-1.css',
      ],
      sync: [
        '/styles/sync-1.css',
      ],
      async: [
        '/styles/async-1.css',
      ]
    }
  });
});
