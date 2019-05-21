import * as handlebars from 'handlebars';

import { HopinTemplate } from '../models/hopin-template';

export function renderBodyAssets(tmpl: HopinTemplate) {
  // async styles
  const lines = [];
  for (const inlineScript of tmpl.scripts.inline.values()) {
    if (inlineScript.type === 'module') {
      lines.push(`<script type="module">${inlineScript.src.trim()}</script>`);
    } else {
      lines.push(`<script>${inlineScript.src.trim()}</script>`);
    }
  }

  // If there are no modules, we can skip adding the 'nomodule' attribute to non-module scripts
  let hasModules = false;
  for (const script of [...tmpl.scripts.sync.values(), ...tmpl.scripts.async.values()]) {
    if (script.endsWith('.mjs')) {
      hasModules = true;
      break;
    }
  }

  for (const syncScript of tmpl.scripts.sync.values()) {
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

  for (const asyncScript of tmpl.scripts.async.values()) {
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

  if (tmpl.styles.async.values().length > 0) {
    const asyncStyles = tmpl.styles.async.values().map((style) => {
      return `'${style}'`;
    }).join(',');
    lines.push(`<script>
window.addEventListener('load', function() {
var __hopin_async_styles = [${asyncStyles}];
for(var i = 0; i < __hopin_async_styles.length; i++) {
var lT = document.createElement('link');
lT.rel = 'stylesheet';
lT.href = __hopin_async_styles[i];
document.head.appendChild(lT);
}
});
</script>`);
  }

  return new handlebars.SafeString(lines.join('\n'));
}