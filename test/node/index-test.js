const path = require('path');
const test = require('ava');
const fs = require('fs-extra');

const { createComponentTemplate, createComponentTemplateFromFile, createHTMLTemplate, createHTMLTemplateFromFile } = require('../../build');

const staticDir = path.join(__dirname, '..', 'static');

test('should create bundle from raw input with abs path', async (t) => {
  const tmplPath = path.join(staticDir, 'index', 'basic-example.tmpl');
  const buffer = await fs.readFile(tmplPath);
  const template = await createComponentTemplate(buffer.toString(), path.dirname(tmplPath));
  const bundle = await template.render();
  t.deepEqual(bundle.renderedTemplate,`Basic Example`);
  t.deepEqual(bundle.styles.inline.values(), [`.inline-css{
  background: green;
}`]);
});

test('should create bundle from raw input without a relative path', async (t) => {
  const tmplPath = path.join(staticDir, 'basic-example.tmpl');
  const buffer = await fs.readFile(tmplPath);
  const template = await createComponentTemplate(buffer.toString());
  const bundle = await template.render();
  t.deepEqual(bundle.renderedTemplate,`Basic Example`);
});

test('should create hopin template from raw input with abs path', async (t) => {
  const tmplPath = path.join(staticDir, 'index', 'basic-example.tmpl');
  const buffer = await fs.readFile(tmplPath);
  const template = await createHTMLTemplate(buffer.toString(), path.dirname(tmplPath));
  const htmlString = await template.render();
  t.deepEqual(htmlString,`Basic Example`);
  t.deepEqual(template.styles.inline.values(), [`.inline-css{
  background: green;
}`]);
});

test('should create hopin template from raw input without a relative path', async (t) => {
  const tmplPath = path.join(staticDir, 'basic-example.tmpl');
  const buffer = await fs.readFile(tmplPath);
  const template = await createHTMLTemplate(buffer.toString());
  const htmlString = await template.render();
  t.deepEqual(htmlString,`Basic Example`);
});

test('should create bundle from file with abs path', async (t) => {
  const tmplPath = path.join(staticDir, 'index', 'basic-example.tmpl');
  const template = await createComponentTemplateFromFile(tmplPath);
  const bundle = await template.render();
  t.deepEqual(bundle.renderedTemplate,`Basic Example`);
  t.deepEqual(bundle.styles.inline.values(), [`.inline-css{
  background: green;
}`]);
});

test('should create bundle from file with relative path', async (t) => {
  const tmplPath = path.join(staticDir, 'index', 'basic-example.tmpl');
  const relpath = path.relative(process.cwd(), tmplPath);
  const template = await createComponentTemplateFromFile(relpath);
  const bundle = await template.render();
  t.deepEqual(bundle.renderedTemplate,`Basic Example`);
  t.deepEqual(bundle.styles.inline.values(), [`.inline-css{
  background: green;
}`]);
});

test('should create hopin template from file with abs path', async (t) => {
  const tmplPath = path.join(staticDir, 'index', 'basic-example.tmpl');
  const template = await createHTMLTemplateFromFile(tmplPath);
  const htmlString = await template.render();
  t.deepEqual(htmlString,`Basic Example`);
  t.deepEqual(template.styles.inline.values(), [`.inline-css{
  background: green;
}`]);
});

test('should create hopin template from file with a relative path', async (t) => {
  const tmplPath = path.join(staticDir, 'index', 'basic-example.tmpl');
  const relpath = path.relative(process.cwd(), tmplPath);
  const template = await createHTMLTemplateFromFile(relpath);
  const htmlString = await template.render();
  t.deepEqual(htmlString,`Basic Example`);
  t.deepEqual(template.styles.inline.values(), [`.inline-css{
  background: green;
}`]);
});