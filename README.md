<h1  align="center">hopin-render</h1>

<p align="center">
  <a href="https://travis-ci.org/gauntface/hopin-render"><img src="https://travis-ci.org/gauntface/hopin-render.svg?branch=master" alt="Travis Build Status" /></a>
  <a href="https://coveralls.io/github/gauntface/hopin-render?branch=master"><img src="https://coveralls.io/repos/github/gauntface/hopin-render/badge.svg?branch=master" alt="Coverage Status" /></a>
  <a href="https://david-dm.org/gauntface/hopin-render" title="dependencies status"><img src="https://david-dm.org/gauntface/hopin-render/status.svg"/></a>
  <a href="https://david-dm.org/gauntface/hopin-rebder?type=dev" title="devDependencies status"><img src="https://david-dm.org/gauntface/hopin-render/dev-status.svg"/></a>
  <a href="https://david-dm.org/gauntface/hopin-render?type=peer" title="peerDependencies status"><img src="https://david-dm.org/gauntface/hopin-render/peer-status.svg"/></a>
</p>

<p align="center">
`hopin-render` uses mustache rendering with a set of wrappers to make it
easier to group templates and partials as "components" with CSS and JS.
This allows CSS and JS to be loaded in a "best practice-y" way.
</p>

<p align="center">
<img a;t="Screenshot of hopin-logger demos in Node and Browser" src="https://raw.githubusercontent.com/gauntface/hopin-logger/master/demo/hopin-logger-screenshots.png" />
</p>

<p align="center">
<img alt="Steven Universe Nerd" src="https://media.giphy.com/media/ioeYm4g2f7cXe/giphy.gif" />
</p>

## Usage in Node

```javascript
const templatePath = path.join(__dirname, 'template.tmpl');
const hopinTemplate = await compileFile(templatePath);

const data = {
  hello: 'world',
};
const options = {
  styles: {
    inline: ['/* Add Inline CSS Here */'],
    sync: ['/synchronous-styles-here.css'],
    async: ['/asynchronous-styles-here.css'],
  },
  scripts: {
    inline: ['/* Add Inline JS Here */'],
    sync: ['/synchronous-scripts-here.css'],
    async: ['/asynchronous-scripts-here.css'],
  },
};
const result = await hopinTemplate.render(data, options);
```
