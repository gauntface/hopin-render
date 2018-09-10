import {test} from 'ava';
import * as sinon from 'sinon';
import * as path from 'path';
import {EOL} from 'os';
import {logger} from '@hopin/logger';
import {compileMarkdownFile} from '../../src/node/index';

test.beforeEach((t) => {
  t.context.sandbox = sinon.createSandbox();
});

test.afterEach.always((t) => {
  t.context.sandbox.restore();
});

test.serial.skip('should throw for a non-existant file', async (t) => {
  const loggerStub = t.context.sandbox.stub(logger, 'error');
  await t.throws(compileMarkdownFile('./test/static/non-existant-file.tmpl'));
  t.deepEqual(loggerStub.callCount, 1, 'logger.error call count');
  t.deepEqual(loggerStub.args[0][0], 'Unable to access \'./test/static/non-existant-file.tmpl\'')
});

test.skip('should compile empty file with relative path', async (t) => {
  const template = await compileMarkdownFile('./test/static/empty-file.tmpl');
  const result = await template.render();
  t.deepEqual(result, '');
});

test.skip('should compile empty file with absolute path', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/empty-file.tmpl'));
  const result = await template.render();
  t.deepEqual(result, '');
});

test.skip('should compile basic file with no data', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/basic-data.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `Hello   Fin.${EOL}`);
});

test.skip('should compile basic file with data', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/basic-data.tmpl'));
  const result = await template.render({
    name: 'World',
  });
  t.deepEqual(result, `Hello World  Fin.${EOL}`);
});

test.skip('should compile basic yaml file', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/basic-yaml.tmpl'));
  const result = await template.render();
  t.deepEqual(result, ``);
});

test.skip('should compile basic yaml file and print yaml data', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/basic-yaml-print.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `I am an example${EOL}`);
});

test.skip('should compile basic partials file', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/basic-partials.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `hello from partial import${EOL}`);
});

test.skip('should compile basic file with styles', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/basic-styles.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `/* Inline CSS */${EOL}${EOL}./sync.css${EOL}/sync.css${EOL}./async.css${EOL}/async.css${EOL}`);
});

test.skip('should compile basic file with duplicate styles', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/duplicate-styles.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `/* Inline CSS */${EOL}${EOL}./sync.css${EOL}/sync.css${EOL}./async.css${EOL}/async.css${EOL}`);
});

test.skip('should compile basic file with scripts', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/basic-scripts.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `/* Inline JS */${EOL}${EOL}/* Inline JS-2 */${EOL}${EOL}./sync.js${EOL}/sync.js${EOL}./async.js${EOL}/async.js${EOL}`);
});

test.skip('should compile basic file with duplicate scripts', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/duplicate-scripts.tmpl'));
  const result = await template.render();
  t.deepEqual(result, `/* Inline JS */${EOL}${EOL}./sync.js${EOL}/sync.js${EOL}./async.js${EOL}/async.js${EOL}`);
});

test.skip('should compile complete file with partials, merging styles and scripts', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/complete-partials.tmpl'));
  const expectedResult = `hello from partial import${EOL}hello from nested partial import${EOL}/* Inline CSS */${EOL}${EOL}/* Inline CSS-3 */${EOL}${EOL}/* Inline CSS-2 */${EOL}${EOL}/* Inline CSS-4 */${EOL}${EOL}/sync.css${EOL}/sync-3.css${EOL}/sync-2.css${EOL}/sync-4.css${EOL}/async.css${EOL}/async-3.css${EOL}/async-2.css${EOL}/async-4.css${EOL}${EOL}/* Inline JS */${EOL}${EOL}/* Inline JS-3 */${EOL}${EOL}/* Inline JS-2 */${EOL}${EOL}/* Inline JS-4 */${EOL}${EOL}/sync.js${EOL}/sync-3.js${EOL}/sync-2.js${EOL}/sync-4.js${EOL}/async.js${EOL}/async-3.js${EOL}/async-2.js${EOL}/async-4.js${EOL}`;
  
  let result = await template.render();
  t.deepEqual(result, expectedResult);

  // The following tests are to ensure 100% coverage
  result = await template.render(null, {});
  t.deepEqual(result, expectedResult);

  result = await template.render(null, {styles: {}, scripts: {}});
  t.deepEqual(result, expectedResult);
});

test.skip('should compile complete file with partials and extras, merging styles and scripts', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/complete-partials.tmpl'));
  const result = await template.render(null, {
    styles: {
      inline: ['/* Inline CSS-5 */'],
      sync: ['/sync-5.css'],
      async: ['/async-5.css'],
    },
    scripts: {
      inline: ['/* Inline JS-5 */'],
      sync: ['/sync-5.js'],
      async: ['/async-5.js'],
    }
  });
  t.deepEqual(result, `hello from partial import${EOL}hello from nested partial import${EOL}/* Inline CSS */${EOL}${EOL}/* Inline CSS-3 */${EOL}${EOL}/* Inline CSS-2 */${EOL}${EOL}/* Inline CSS-4 */${EOL}${EOL}/* Inline CSS-5 */${EOL}/sync.css${EOL}/sync-3.css${EOL}/sync-2.css${EOL}/sync-4.css${EOL}/sync-5.css${EOL}/async.css${EOL}/async-3.css${EOL}/async-2.css${EOL}/async-4.css${EOL}/async-5.css${EOL}${EOL}/* Inline JS */${EOL}${EOL}/* Inline JS-3 */${EOL}${EOL}/* Inline JS-2 */${EOL}${EOL}/* Inline JS-4 */${EOL}${EOL}/* Inline JS-5 */${EOL}/sync.js${EOL}/sync-3.js${EOL}/sync-2.js${EOL}/sync-4.js${EOL}/sync-5.js${EOL}/async.js${EOL}/async-3.js${EOL}/async-2.js${EOL}/async-4.js${EOL}/async-5.js${EOL}`);
});

test.skip('should compile complete file using helpers for scripts (with modules) and styles', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/complete-with-helpers-with-modules.tmpl'));
  const expectedResult = `hello from partial import${EOL}hello from nested partial import\n<style>/* Inline CSS */</style>\n<style>/* Inline CSS-3 */</style>\n<style>/* Inline CSS-2 */</style>\n<style>/* Inline CSS-4 */</style>\n<link rel="stylesheet" type="text/css" href="/sync.css" />\n<link rel="stylesheet" type="text/css" href="/sync-3.css" />\n<link rel="stylesheet" type="text/css" href="/sync-2.css" />\n<link rel="stylesheet" type="text/css" href="/sync-4.css" />\n<script>/* Inline JS */</script>\n<script>/* Inline JS-3 */</script>\n<script>/* Inline JS-2 */</script>\n<script>/* Inline JS-4 */</script>\n<script src="/sync.js" nomodule></script>\n<script src="/sync-3.mjs" type="module"></script>\n<script src="/sync-2.js" nomodule></script>\n<script src="/sync-4.js" nomodule></script>\n<script src="/async.js" async defer nomodule></script>\n<script src="/async-3.mjs" async defer type="module"></script>\n<script src="/async-2.js" async defer nomodule></script>\n<script src="/async-4.js" async defer nomodule></script>
<script>
window.addEventListener('load', function() {
  var __hopin_async_styles = ['/async.css','/async-3.css','/async-2.css','/async-4.css'];
  for(var i = 0; i < __hopin_async_styles.length; i++) {
    var linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = __hopin_async_styles[i];
    document.head.appendChild(linkTag);
  }
});
</script>`;
  
  let result = await template.render();
  t.deepEqual(result, expectedResult);
});

test.skip('should compile complete file using helpers for scripts (without modules) and styles', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/complete-with-helpers-without-modules.tmpl'));
  const expectedResult = `hello from partial import${EOL}hello from nested partial import\n<style>/* Inline CSS */</style>\n<style>/* Inline CSS-3 */</style>\n<style>/* Inline CSS-2 */</style>\n<style>/* Inline CSS-4 */</style>\n<link rel="stylesheet" type="text/css" href="/sync.css" />\n<link rel="stylesheet" type="text/css" href="/sync-3.css" />\n<link rel="stylesheet" type="text/css" href="/sync-2.css" />\n<link rel="stylesheet" type="text/css" href="/sync-4.css" />\n<script>/* Inline JS */</script>\n<script>/* Inline JS-3 */</script>\n<script>/* Inline JS-2 */</script>\n<script>/* Inline JS-4 */</script>\n<script src="/sync.js"></script>\n<script src="/sync-3.js"></script>\n<script src="/sync-2.js"></script>\n<script src="/sync-4.js"></script>\n<script src="/async.js" async defer></script>\n<script src="/async-3.js" async defer></script>\n<script src="/async-2.js" async defer></script>\n<script src="/async-4.js" async defer></script>
<script>
window.addEventListener('load', function() {
  var __hopin_async_styles = ['/async.css','/async-3.css','/async-2.css','/async-4.css'];
  for(var i = 0; i < __hopin_async_styles.length; i++) {
    var linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = __hopin_async_styles[i];
    document.head.appendChild(linkTag);
  }
});
</script>`;
  
  let result = await template.render();
  t.deepEqual(result, expectedResult);
});

test.skip('should compile complete file using helpers for scripts and optional extras', async (t) => {
  const template = await compileMarkdownFile(path.join(__dirname, '../static/complete-with-helpers-without-modules.tmpl'));
  const expectedResult = `hello from partial import${EOL}hello from nested partial import\n<style>/* Inline CSS */</style>\n<style>/* Inline CSS-3 */</style>\n<style>/* Inline CSS-2 */</style>\n<style>/* Inline CSS-4 */</style>\n<link rel="stylesheet" type="text/css" href="/sync.css" />\n<link rel="stylesheet" type="text/css" href="/sync-3.css" />\n<link rel="stylesheet" type="text/css" href="/sync-2.css" />\n<link rel="stylesheet" type="text/css" href="/sync-4.css" />\n<script>/* Inline JS */</script>\n<script>/* Inline JS-3 */</script>\n<script>/* Inline JS-2 */</script>\n<script>/* Inline JS-4 */</script>\n<script type="module">/* Inline script options (mod) */</script>\n<script>/* Inline script options (no-mod) */</script>\n<script src="/sync.js"></script>\n<script src="/sync-3.js"></script>\n<script src="/sync-2.js"></script>\n<script src="/sync-4.js"></script>\n<script src="/async.js" async defer></script>\n<script src="/async-3.js" async defer></script>\n<script src="/async-2.js" async defer></script>\n<script src="/async-4.js" async defer></script>
<script>
window.addEventListener('load', function() {
  var __hopin_async_styles = ['/async.css','/async-3.css','/async-2.css','/async-4.css'];
  for(var i = 0; i < __hopin_async_styles.length; i++) {
    var linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = __hopin_async_styles[i];
    document.head.appendChild(linkTag);
  }
});
</script>`;
  
  let result = await template.render(null, {
    scripts: {
      inline: [
        {
          src: '/* Inline script options (mod) */',
          type: 'module',
        },
        {
          src: '/* Inline script options (no-mod) */',
          type: 'nomodule',
        },
      ],
    }
  });
  t.deepEqual(result, expectedResult);
});