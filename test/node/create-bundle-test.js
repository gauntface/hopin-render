const fs = require('fs-extra');
const path = require('path');
const {test} = require('ava');

import { createBundle } from '../../build/create-bundle';

const staticDir = path.join(__dirname, '..', 'static');

test('should generate bundle', async (t) => {
  const rawInput = await fs.readFile(path.join(staticDir, 'bundle-example.tmpl'));
  const bundle = await createBundle(rawInput.toString(), staticDir);
  
  // Scripts
  t.deepEqual(bundle.scripts.inline.values(), [
    {
      src: `console.log('inline-1.js');`,
      type: 'nomodule',
    },
    {
      src: `console.log('inline-1.mjs');`,
      type: 'module',
    },
    {
      src: `console.log('inline-1.2.js');`,
      type: 'nomodule',
    },
    {
      src: `console.log('inline-1.3.js');`,
      type: 'module',
    },
    {
      src: `console.log('inline-2.js');`,
      type: 'nomodule',
    },
    {
      src: `console.log('inline-2.mjs');`,
      type: 'module',
    },
    {
      src: `console.log('inline-2.2.js');`,
      type: 'nomodule',
    },
    {
      src: `console.log('inline-2.3.js');`,
      type: 'module',
    },
    {
      src: `console.log('inline-3.js');`,
      type: 'nomodule',
    },
  ]);

  t.deepEqual(bundle.scripts.sync.values(), [
    './extra-files/scripts/sync-1.js',
    './scripts/sync-2.js',
    './scripts/sync-3.js',
  ]);

  t.deepEqual(bundle.scripts.async.values(), [
    './extra-files/scripts/async-1.js',
    './scripts/async-2.js',
    './scripts/async-3.js',
  ]);

  // Styles
  t.deepEqual(bundle.styles.inline.values(), [
    '.inline1{}',
    '.inline2{}',
    '.inline3{}',
  ]);

  t.deepEqual(bundle.styles.sync.values(), [
    './extra-files/styles/sync-1.css',
    './styles/sync-2.css',
    './styles/sync-3.css',
  ]);

  t.deepEqual(bundle.styles.async.values(), [
    './extra-files/styles/async-1.css',
    './styles/async-2.css',
    './styles/async-3.css',
  ]);

  t.deepEqual((bundle.template.yaml)['hello'], 'world 1');

  t.deepEqual(bundle.template.content, '<h1>HTML</h1>\n# MD\n\n{{ yaml.hello }}\n{{ data.hello }}\n{{ topLevelExample }}\n\n{{> ./extra-files/partials-example-import.tmpl}}');

  const childTemplatesOne = bundle.template.partials.values();
  t.deepEqual(childTemplatesOne.length, 1);
  const idTwo = childTemplatesOne[0].id
  const templateTwo = childTemplatesOne[0].template
  t.deepEqual((templateTwo.yaml)['hello'], 'world 2');
  t.deepEqual(idTwo, './extra-files/partials-example-import.tmpl');
  t.deepEqual(templateTwo.content, '<h2>HTML</h2>\n## MD\n\n{{ yaml.hello }}\n{{ data.hello }}\n\n{{> ./partials-example-nested-import.tmpl}}');

  const childTemplatesTwo = templateTwo.partials.values();
  t.deepEqual(childTemplatesTwo.length, 1);
  const idThree = childTemplatesTwo[0].id
  const templateThree = childTemplatesTwo[0].template
  t.deepEqual((templateThree.yaml)['hello'], 'world 3');
  t.deepEqual(idThree, './partials-example-nested-import.tmpl');
  t.deepEqual(templateThree.content, '<h3>HTML</h3>\n### MD\n\n{{ yaml.hello }}\n{{ data.hello }}');
});