const fs = require('fs-extra');
const path = require('path');
const {test} = require('ava');

const { createBundle } = require('../../build/create-bundle');
const { renderBundle } = require('../../build/render-bundle');

const staticDir = path.join(__dirname, '..', 'static');

test('should render bundle', async (t) => {
  const rawInput = await fs.readFile(path.join(staticDir, 'bundle-example.tmpl'));
  const bundle = await createBundle(rawInput.toString(), staticDir);
  const result = await renderBundle(bundle, {hello: 'world data'});
  t.deepEqual(result, '<h1>HTML</h1>\n# MD\n\nworld 1\nworld data\n\n<h2>HTML</h2>\n## MD\n\nworld 2\nworld data\n\n<h3>HTML</h3>\n### MD\n\nworld 3\nworld data');
});