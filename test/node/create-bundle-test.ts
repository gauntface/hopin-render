import * as fs from 'fs-extra';
import * as path from 'path';
import {test} from 'ava';

import {parseYaml} from '../../src/node/parse-yaml';
import { createBundle } from '../../src/node/create-bundle';

const staticDir = path.join(__dirname, '..', 'static');
const extraDir = path.join(staticDir, 'extra-files');
const scriptsDir = path.join(extraDir, 'scripts');
const stylesDir = path.join(extraDir, 'styles');

test('should generate bundle', async (t) => {
  const rawInput = await fs.readFile(path.join(staticDir, 'bundle-example.tmpl'));
  const bundle = await createBundle(rawInput.toString(), staticDir);
  
  // Scripts
  t.deepEqual(bundle.scripts.inline.values(), [
    {
      src: path.join(scriptsDir, 'inline-1.js'),
      type: 'nomodule',
    },
    {
      src:path.join(scriptsDir, 'inline-1.2.js'),
      type: 'nomodule',
    },
    {
      src: path.join(scriptsDir, 'inline-1.3.js'),
      type: 'module',
    },
    {
      src: path.join(scriptsDir, 'inline-2.js'),
      type: 'nomodule',
    },
    {
      src: path.join(scriptsDir, 'inline-2.2.js'),
      type: 'nomodule',
    },
    {
      src: path.join(scriptsDir, 'inline-2.3.js'),
      type: 'module',
    },
    {
      src: path.join(scriptsDir, 'inline-3.js'),
      type: 'nomodule',
    },
    {
      src: path.join(scriptsDir, 'inline-3.2.js'),
      type: 'nomodule',
    },
    {
      src: path.join(scriptsDir, 'inline-3.3.js'),
      type: 'module',
    },
  ]);

  t.deepEqual(bundle.scripts.sync.values(), [
    path.join(scriptsDir, 'sync-1.js'),
    path.join(scriptsDir, 'sync-2.js'),
    path.join(scriptsDir, 'sync-3.js'),
  ]);

  t.deepEqual(bundle.scripts.async.values(), [
    path.join(scriptsDir, 'async-1.js'),
    path.join(scriptsDir, 'async-2.js'),
    path.join(scriptsDir, 'async-3.js'),
  ]);

  // Styles
  t.deepEqual(bundle.styles.inline.values(), [
    path.join(stylesDir, 'inline-1.css'),
    path.join(stylesDir, 'inline-2.css'),
    path.join(stylesDir, 'inline-3.css'),
  ]);

  t.deepEqual(bundle.styles.sync.values(), [
    path.join(stylesDir, 'sync-1.css'),
    path.join(stylesDir, 'sync-2.css'),
    path.join(stylesDir, 'sync-3.css'),
  ]);

  t.deepEqual(bundle.styles.async.values(), [
    path.join(stylesDir, 'async-1.css'),
    path.join(stylesDir, 'async-2.css'),
    path.join(stylesDir, 'async-3.css'),
  ]);

  // tslint:disable-next-line:no-any
  t.deepEqual((bundle.template.yaml as any)['hello'], 'world 1');

  t.deepEqual(bundle.template.content, '<h1>HTML</h1>\n# MD\n\n{{ yaml.hello }}\n{{ data.hello }}\n\n{{> ./extra-files/partials-example-import.tmpl}}');

  const childTemplatesOne = bundle.template.partials.values();
  t.deepEqual(childTemplatesOne.length, 1);
  const idTwo = childTemplatesOne[0].id
  const templateTwo = childTemplatesOne[0].template
  // tslint:disable-next-line:no-any
  t.deepEqual((templateTwo.yaml as any)['hello'], 'world 2');
  t.deepEqual(idTwo, './extra-files/partials-example-import.tmpl');
  t.deepEqual(templateTwo.content, '<h2>HTML</h2>\n## MD\n\n{{ yaml.hello }}\n{{ data.hello }}\n\n{{> ./partials-example-nested-import.tmpl}}');

  const childTemplatesTwo = templateTwo.partials.values();
  t.deepEqual(childTemplatesTwo.length, 1);
  const idThree = childTemplatesTwo[0].id
  const templateThree = childTemplatesTwo[0].template
  // tslint:disable-next-line:no-any
  t.deepEqual((templateThree.yaml as any)['hello'], 'world 3');
  t.deepEqual(idThree, './partials-example-nested-import.tmpl');
  t.deepEqual(templateThree.content, '<h3>HTML</h3>\n### MD\n\n{{ yaml.hello }}\n{{ data.hello }}');
});