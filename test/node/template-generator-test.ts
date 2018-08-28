import * as fs from 'fs-extra';
import * as path from 'path';
import {test} from 'ava';

import {createTemplateFromFile} from '../../src/node/index';
import {seperateYamlAndText} from '../../src/node/template-generator';

const staticDir = path.join(__dirname, '..', 'static');

test('should generate example template', async (t) => {
  const rawInput = await fs.readFile(path.join(staticDir, 'yaml-example.tmpl'));
  const {yaml, rawText} = await seperateYamlAndText(rawInput.toString(), staticDir);
  
  // Partials
  t.deepEqual(yaml.partials.values(), [
    {
      id: './extra-files/partials-example-nested-import.tmpl',
      template: await createTemplateFromFile(path.join(staticDir, 'extra-files', 'partials-example-nested-import.tmpl')),
    }
  ]);
  
  // Styles
  t.deepEqual(yaml.styles.inline.values(), [
    path.join(staticDir, 'inline-rel.css'),
    '/inline-abs.css'
  ]);
  t.deepEqual(yaml.styles.sync.values(), [
    path.join(staticDir, 'sync-rel.css'),
    '/sync-abs.css'
  ]);
  t.deepEqual(yaml.styles.async.values(), [
    path.join(staticDir, 'async-rel.css'),
    '/async-abs.css'
  ]);

  // Scripts
  t.deepEqual(yaml.scripts.inline.values(), [
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
  t.deepEqual(yaml.scripts.sync.values(), [
    path.join(staticDir, 'sync-rel.js'),
    '/sync-abs.js',
  ]);
  t.deepEqual(yaml.scripts.async.values(), [
    path.join(staticDir, 'async-rel.js'),
    '/async-abs.js',
  ]);

  t.deepEqual(yaml.yaml, {
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
      './extra-files/partials-example-nested-import.tmpl',
    ],
  });

  // Content
  t.deepEqual(rawText, '<h1>Example HTML</h1>\n\n## Example Markdown');
});