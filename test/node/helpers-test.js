const path = require('path');
const test = require('ava');

const { createTemplateFromFile } = require('../../build');

const staticDir = path.join(__dirname, '..', 'static');

test('should render with hopin header and body helpers', async (t) => {
  const template = await createTemplateFromFile(path.join(staticDir, 'helpers-example.tmpl'));
  const html = await template.render();
  t.deepEqual(html,`
<style>.inline1{}</style>
<style>.inline2{}</style>
<link rel="stylesheet" type="text/css" href="/styles/sync-1.css" />
<link rel="stylesheet" type="text/css" href="/styles/sync-2.css" />

<script>console.log('inline-1.js');</script>
<script type="module">console.log('inline-1.mjs');</script>
<script>console.log('inline-1.2.js');</script>
<script type="module">console.log('inline-1.3.js');</script>
<script>console.log('inline-2.js');</script>
<script type="module">console.log('inline-2.mjs');</script>
<script>console.log('inline-2.2.js');</script>
<script type="module">console.log('inline-2.3.js');</script>
<script src="/scripts/sync-1.js" nomodule></script>
<script src="/scripts/sync-1.mjs" type="module"></script>
<script src="/scripts/sync-2.js" nomodule></script>
<script src="/scripts/sync-2.mjs" type="module"></script>
<script src="/scripts/async-1.js" async defer nomodule></script>
<script src="/scripts/async-1.mjs" async defer type="module"></script>
<script src="/scripts/async-2.js" async defer nomodule></script>
<script src="/scripts/async-2.mjs" async defer type="module"></script>
<script>
window.addEventListener('load', function() {
var __hopin_async_styles = ['/styles/async-1.css','/styles/async-2.css'];
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
  const template = await createTemplateFromFile(path.join(staticDir, 'helpers-limit-array-example.tmpl'));
  const html = await template.render();
  t.deepEqual(html,`First Item
Second Item

First Item

`);
});