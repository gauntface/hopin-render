import * as handlebars from 'handlebars';

import {Bundle} from './create-bundle';

export async function renderBundle(bundle: Bundle): Promise<string> {
  const handlebarsInstance = handlebars.create();
  
  // Register template helpers
  handlebarsInstance.registerHelper('hopin_headAssets', () => renderHeadAssets(bundle));
  handlebarsInstance.registerHelper('hopin_bodyAssets', () => renderBodyAssets(bundle));
  
  // Register partials
  /* for (const partialName of Object.keys(compilation.partials)) {
    const template = compilation.partials[partialName];
    const renderedPartial = await template.render(data);
    handlebarsInstance.registerPartial(partialName, renderedPartial);
  }*/

  const handlebarsTemplate = handlebarsInstance.compile(bundle.template.content);
  return handlebarsTemplate({});
}

function renderHeadAssets(bundle: Bundle) {
  /* const lines = [];
  for (const inlineStyle of compilation.styles.inline) {
    lines.push(`<style>${handlebars.escapeExpression(inlineStyle.trim())}</style>`);
  }
  for (const syncStyle of compilation.styles.sync) {
    lines.push(`<link rel="stylesheet" type="text/css" href="${handlebars.escapeExpression(syncStyle)}" />`);
  }
  return new handlebars.SafeString(lines.join('\n'));*/
}

function renderBodyAssets(bundle: Bundle) {
  /* // async styles
  const lines = [];
  for (const inlineScript of compilation.scripts.inline.values()) {
    if (inlineScript.type === 'module') {
      lines.push(`<script type="module">${handlebars.escapeExpression(inlineScript.src.trim())}</script>`);
    } else {
      lines.push(`<script>${handlebars.escapeExpression(inlineScript.src.trim())}</script>`);
    }
  }

  let hasModules = false;
  for (const script of [...compilation.scripts.sync, ...compilation.scripts.async]) {
    if (script.endsWith('.mjs')) {
      hasModules = true;
      break;
    }
  }

  for (const syncScript of compilation.scripts.sync) {
    const attributes = [
      `src="${handlebars.escapeExpression(syncScript)}"`,
    ];
    if (hasModules) {
      if (syncScript.endsWith('.mjs')) {
        attributes.push('type="module"');
      } else {
        attributes.push('nomodule');
      }
    }
    lines.push(`<script ${attributes.join(' ')}></script>`);
  }

  for (const asyncScript of compilation.scripts.async) {
    const attributes = [
      `src="${handlebars.escapeExpression(asyncScript)}"`,
      'async',
      'defer',
    ];
    if (hasModules) {
      if (asyncScript.endsWith('.mjs')) {
        attributes.push('type="module"');
      } else {
        attributes.push('nomodule');
      }
    }
    lines.push(`<script ${attributes.join(' ')}></script>`);
  }

  if (compilation.styles.async.size > 0) {
    const asyncStyles = Array.from(compilation.styles.async).map((style) => {
      return `'${style}'`;
    }).join(',');
    lines.push(`<script>
window.addEventListener('load', function() {
var __hopin_async_styles = [${asyncStyles}];
for(var i = 0; i < __hopin_async_styles.length; i++) {
var linkTag = document.createElement('link');
linkTag.rel = 'stylesheet';
linkTag.href = __hopin_async_styles[i];
document.head.appendChild(linkTag);
}
});
</script>`);
  }

  return new handlebars.SafeString(lines.join('\n'));*/
}