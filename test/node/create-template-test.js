const fs = require('fs-extra');
const path = require('path');
const test = require('ava');
const sinon = require('sinon');

import { createTemplate, createTemplateFromFile } from '../../build/index';

const staticDir = path.join(__dirname, '..', 'static');

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

test('should generate template', async (t) => {
  const rawInput = await fs.readFile(path.join(staticDir, 'bundle-example.tmpl'));
  const template = await createTemplate(rawInput.toString(), staticDir);
  
  // Scripts
  t.deepEqual(template.scripts.inline.values(), [
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

  t.deepEqual(template.scripts.sync.values(), [
    './extra-files/scripts/sync-1.js',
    './scripts/sync-2.js',
    './scripts/sync-3.js',
  ]);

  t.deepEqual(template.scripts.async.values(), [
    './extra-files/scripts/async-1.js',
    './scripts/async-2.js',
    './scripts/async-3.js',
  ]);

  // Styles
  t.deepEqual(template.styles.inline.values(), [
    '.inline1{}',
    '.inline2{}',
    '.inline3{}',
  ]);

  t.deepEqual(template.styles.sync.values(), [
    './extra-files/styles/sync-1.css',
    './styles/sync-2.css',
    './styles/sync-3.css',
  ]);

  t.deepEqual(template.styles.async.values(), [
    './extra-files/styles/async-1.css',
    './styles/async-2.css',
    './styles/async-3.css',
  ]);

  t.deepEqual((template.yaml)['hello'], 'world 1');

  const html = await template.render();
  t.deepEqual(html,`<h1>HTML</h1>
# MD

world 1



<h2>HTML</h2>
## MD

world 2


<h3>HTML</h3>
### MD

world 3
`);
});

test.serial('should generate template using current working directory as path', async (t) => {
  const rawInput = await fs.readFile(path.join(staticDir, 'bundle-example.tmpl'));
  
  t.context.sandbox.stub(process, 'cwd').returns(staticDir);

  const template = await createTemplate(rawInput.toString());
  
  // Scripts
  t.deepEqual(template.scripts.inline.values(), [
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

  t.deepEqual(template.scripts.sync.values(), [
    './extra-files/scripts/sync-1.js',
    './scripts/sync-2.js',
    './scripts/sync-3.js',
  ]);

  t.deepEqual(template.scripts.async.values(), [
    './extra-files/scripts/async-1.js',
    './scripts/async-2.js',
    './scripts/async-3.js',
  ]);

  // Styles
  t.deepEqual(template.styles.inline.values(), [
    '.inline1{}',
    '.inline2{}',
    '.inline3{}',
  ]);

  t.deepEqual(template.styles.sync.values(), [
    './extra-files/styles/sync-1.css',
    './styles/sync-2.css',
    './styles/sync-3.css',
  ]);

  t.deepEqual(template.styles.async.values(), [
    './extra-files/styles/async-1.css',
    './styles/async-2.css',
    './styles/async-3.css',
  ]);

  t.deepEqual((template.yaml)['hello'], 'world 1');

  const html = await template.render();
  
  t.deepEqual(html,`<h1>HTML</h1>
# MD

world 1



<h2>HTML</h2>
## MD

world 2


<h3>HTML</h3>
### MD

world 3
`);
});

test('should generate template using resolved path', async (t) => {  
  const template = await createTemplateFromFile('./test/static/basic-example.tmpl');
  
  const html = await template.render();
  
  t.deepEqual(html,`Basic Example`);
});