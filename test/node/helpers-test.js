const path = require('path');
const test = require('ava');

const { createHTMLTemplateFromFile, createComponentTemplateFromFile } = require('../../build');

const staticDir = path.join(__dirname, '..', 'static');

test('should render with hopin header and body helpers', async (t) => {
  const template = createHTMLTemplateFromFile(path.join(staticDir, 'helpers-example.tmpl'));
  t.deepEqual(template.elements, ['div']);
  const html = template.render();
  t.deepEqual(html,`<style>.inline1{}</style>
<link rel="stylesheet" type="text/css" href="/styles/sync-1.css" />



<script>console.log('inline-1.js');</script>
<script type="module">console.log('inline-1.mjs');</script>
<script>console.log('inline-1.2.js');</script>
<script type="module">console.log('inline-1.3.js');</script>
<script src="/scripts/sync-1.js" nomodule></script>
<script src="/scripts/sync-1.mjs" type="module"></script>
<script src="/scripts/async-1.js" async defer nomodule></script>
<script src="/scripts/async-1.mjs" async defer type="module"></script>
<script>
window.addEventListener('load', function() {
var __hopin_async_styles = ['/styles/async-1.css'];
for(var i = 0; i < __hopin_async_styles.length; i++) {
var lT = document.createElement('link');
lT.rel = 'stylesheet';
lT.href = __hopin_async_styles[i];
document.head.appendChild(lT);
}
});
</script>`);
});

test('should render with array limit helper', async (t) => {
  const template = await createHTMLTemplateFromFile(path.join(staticDir, 'helpers-limit-array-example.tmpl'));
  const html = await template.render();
  t.deepEqual(html,`First Item
Second Item

First Item

`);
});

test('should load component', async (t) => {
  const template = await createComponentTemplateFromFile(path.join(staticDir, 'helpers', 'load-component-example.tmpl'));
  const bundle = template.render();
  t.deepEqual(bundle.renderedTemplate,`<h1>Example HTML</h1>

## Example Markdown`);
  t.deepEqual(bundle.elements, ['p', 'h1']);

  t.deepEqual(bundle.scripts.inline.values(), [
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
  t.deepEqual(bundle.scripts.sync.values(), [
    './sync-rel.js',
    '/sync-abs.js',
  ]);
  t.deepEqual(bundle.scripts.async.values(), [
    './async-rel.js',
    '/async-abs.js',
  ]);
  
  t.deepEqual(bundle.styles.inline.values(), [
    '.inline1{}',
  ]);
  t.deepEqual(bundle.styles.sync.values(), [
    './sync-rel.css',
    '/sync-abs.css',
  ]);
  t.deepEqual(bundle.styles.async.values(), [
    './async-rel.css',
    '/async-abs.css',
  ]);
});

test('should load component into template', async (t) => {
  const cmptemplate = await createComponentTemplateFromFile(path.join(staticDir, 'helpers', 'load-component-example.tmpl'));
  const bundle = cmptemplate.render();
  const htemplate = createHTMLTemplateFromFile(path.join(staticDir, 'helpers-example.tmpl'));
  const html = htemplate.render(bundle);
  t.deepEqual(html,`<style>.inline1{}</style>
<link rel="stylesheet" type="text/css" href="/styles/sync-1.css" />
<link rel="stylesheet" type="text/css" href="./sync-rel.css" />
<link rel="stylesheet" type="text/css" href="/sync-abs.css" />

&lt;h1&gt;Example HTML&lt;/h1&gt;

## Example Markdown

<script>console.log('inline-1.js');</script>
<script type="module">console.log('inline-1.mjs');</script>
<script>console.log('inline-1.2.js');</script>
<script type="module">console.log('inline-1.3.js');</script>
<script src="/scripts/sync-1.js" nomodule></script>
<script src="/scripts/sync-1.mjs" type="module"></script>
<script src="./sync-rel.js" nomodule></script>
<script src="/sync-abs.js" nomodule></script>
<script src="/scripts/async-1.js" async defer nomodule></script>
<script src="/scripts/async-1.mjs" async defer type="module"></script>
<script src="./async-rel.js" async defer nomodule></script>
<script src="/async-abs.js" async defer nomodule></script>
<script>
window.addEventListener('load', function() {
var __hopin_async_styles = ['/styles/async-1.css','./async-rel.css','/async-abs.css'];
for(var i = 0; i < __hopin_async_styles.length; i++) {
var lT = document.createElement('link');
lT.rel = 'stylesheet';
lT.href = __hopin_async_styles[i];
document.head.appendChild(lT);
}
});
</script>`);
});

test('should return error if load component doesnt have a file', async (t) => {
  const tmpl = await createComponentTemplateFromFile(path.join(staticDir, 'helpers', 'load-component-no-file.tmpl'));
  try {
    tmpl.render();
    throw new Error('Expected error to be thrown');
  } catch (e) {
    t.deepEqual(e.message, 'hopin_loadComponent needs a file for the first argument');
  }
});