const fs = require('fs-extra');
const path = require('path');
const {test} = require('ava');

const {parseYaml} = require('../../build/parse-yaml');

const staticDir = path.join(__dirname, '..', 'static');

test('should generate example yaml', async (t) => {
  const rawInput = await fs.readFile(path.join(staticDir, 'yaml-example.tmpl'));
  const {styles, scripts, partials, content, rawYaml} = await parseYaml(rawInput.toString(), staticDir);

  // Partials
  t.deepEqual(partials, {
    './example-partial.tmpl': path.join(staticDir, 'example-partial.tmpl'),
  });

  // Styles
  t.deepEqual(styles.inline.values(), [
    '.inline1{}',
  ]);
  t.deepEqual(styles.sync.values(), [
    './sync-rel.css',
    '/sync-abs.css'
  ]);
  t.deepEqual(styles.async.values(), [
    './async-rel.css',
    '/async-abs.css'
  ]);

  // Scripts
  t.deepEqual(scripts.inline.values(), [
    {
      src: 'console.log(\'inline-1.js\');',
      type: 'nomodule',
    },
    {
      src: 'console.log(\'inline-1.mjs\');',
      type: 'module',
    },
    {
      src: 'console.log(\'inline-1.2.js\');',
      type: 'nomodule',
    },
    {
      src: 'console.log(\'inline-1.3.js\');',
      type: 'module',
    },
  ]);
  t.deepEqual(scripts.sync.values(), [
    './sync-rel.js',
    '/sync-abs.js',
  ]);
  t.deepEqual(scripts.async.values(), [
    './async-rel.js',
    '/async-abs.js',
  ]);


  // Content
  t.deepEqual(content, '<h1>Example HTML</h1>\n\n## Example Markdown');

  // Yaml
  t.deepEqual(rawYaml, {
    hello: {
      world: [
        'I\'m an example',
      ],
    },
    data: {
      exampleObj: {
        top: 'example string',
        nesting: [
          'Nesting array 1',
          'Nesting array 2',
        ],
      },
    },
    styles: {
      inline: [
        './extra-files/styles/inline-1.css',
      ],
      sync: [
        './sync-rel.css',
        '/sync-abs.css',
      ],
      async: [
        './async-rel.css',
        '/async-abs.css',
      ],
    },
    scripts: {
      inline: [
        './extra-files/scripts/inline-1.js',
        './extra-files/scripts/inline-1.mjs',
        {
          'inline-2': null,
          src: './extra-files/scripts/inline-1.2.js',
          type: 'nomodule',
        },
        {
          'inline-3': {
            src: './extra-files/scripts/inline-1.3.js',
            type: 'module',
          },
        },
      ],
      sync: [
        './sync-rel.js',
        '/sync-abs.js',
      ],
      async: [
        './async-rel.js',
        '/async-abs.js',
      ],
    },
    partials: [
      './example-partial.tmpl',
    ],
  });
});

test('should handle styles and scripts without inline, sync and async fields', async (t) => {
  const yamlInput = `---
styles:
  bad: styles
scripts:
  bad: scripts
---
`;
  const {styles, scripts, partials, content, rawYaml} = await parseYaml(yamlInput, staticDir);

  // Partials
  t.deepEqual(partials, {});

  // Styles
  t.deepEqual(styles.inline.values(), []);
  t.deepEqual(styles.sync.values(), []);
  t.deepEqual(styles.async.values(), []);

  // Scripts
  t.deepEqual(scripts.inline.values(), []);
  t.deepEqual(scripts.sync.values(), []);
  t.deepEqual(scripts.async.values(), []);


  // Content
  t.deepEqual(content, '');

  // Yaml
  t.deepEqual(rawYaml, {
    styles: {
      bad: 'styles',
    },
    scripts: {
      bad: 'scripts',
    },
  });
});

test('should handle styles and scripts with non strings in array for inline, sync and async fields', async (t) => {
  const yamlInput = `---
styles:
  inline:
    - bad: inline
  sync:
    - bad: sync
  async:
    - bad: async
scripts:
  inline:
    - bad: inline
  sync:
    - bad: sync
  async:
    - bad: async
---
`;
  const {styles, scripts, partials, content, rawYaml} = await parseYaml(yamlInput, staticDir);

  // Partials
  t.deepEqual(partials, {});

  // Styles
  t.deepEqual(styles.inline.values(), []);
  t.deepEqual(styles.sync.values(), []);
  t.deepEqual(styles.async.values(), []);

  // Scripts
  t.deepEqual(scripts.inline.values(), []);
  t.deepEqual(scripts.sync.values(), []);
  t.deepEqual(scripts.async.values(), []);

  // Content
  t.deepEqual(content, '');

  // Yaml
  t.deepEqual(rawYaml, {
    styles: {
      inline: [{bad: 'inline'}],
      sync: [{bad: 'sync'}],
      async: [{bad: 'async'}],
    },
    scripts: {
      inline: [{bad: 'inline'}],
      sync: [{bad: 'sync'}],
      async: [{bad: 'async'}],
    },
  });
});

test('should handle partials with non-string entries', async (t) => {
  const yamlInput = `---
partials:
  - bad: partials
---
`;
  const {styles, scripts, partials, content, rawYaml} = await parseYaml(yamlInput, staticDir);

  // Partials
  t.deepEqual(partials, {});

  // Styles
  t.deepEqual(styles.inline.values(), []);
  t.deepEqual(styles.sync.values(), []);
  t.deepEqual(styles.async.values(), []);

  // Scripts
  t.deepEqual(scripts.inline.values(), []);
  t.deepEqual(scripts.sync.values(), []);
  t.deepEqual(scripts.async.values(), []);


  // Content
  t.deepEqual(content, '');

  // Yaml
  t.deepEqual(rawYaml, {
    partials: [{
      bad: 'partials',
    }],
  });
});