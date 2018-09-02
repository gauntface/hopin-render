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
    path.join(staticDir, 'inline-rel.css'),
    '/inline-abs.css'
  ]);
  t.deepEqual(styles.sync.values(), [
    path.join(staticDir, 'sync-rel.css'),
    '/sync-abs.css'
  ]);
  t.deepEqual(styles.async.values(), [
    path.join(staticDir, 'async-rel.css'),
    '/async-abs.css'
  ]);

  // Scripts
  t.deepEqual(scripts.inline.values(), [
    {
      src: path.join(staticDir, 'inline-rel.js'),
      type: 'nomodule',
    },
    {
      src: '/inline-abs.js',
      type: 'nomodule',
    },
    {
      src: path.join(staticDir, 'inline-2-rel.js'),
      type: 'nomodule',
    },
    {
      src: '/inline-3-abs.js',
      type: 'module',
    },
  ]);
  t.deepEqual(scripts.sync.values(), [
    path.join(staticDir, 'sync-rel.js'),
    '/sync-abs.js',
  ]);
  t.deepEqual(scripts.async.values(), [
    path.join(staticDir, 'async-rel.js'),
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
        './inline-rel.css',
        '/inline-abs.css',
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
        './inline-rel.js',
        '/inline-abs.js',
        {
          'inline-2': null,
          src: './inline-2-rel.js',
          type: 'nomodule',
        },
        {
          'inline-3': {
            src: '/inline-3-abs.js',
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