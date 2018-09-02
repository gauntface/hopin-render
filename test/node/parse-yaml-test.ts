import * as fs from 'fs-extra';
import * as path from 'path';
import {test} from 'ava';

import {parseYaml} from '../../src/node/parse-yaml';

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