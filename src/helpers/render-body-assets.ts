import * as handlebars from 'handlebars';

import {Bundle} from '../create-bundle';

export function renderBodyAssets(bundle: Bundle) {
  // async styles
  const lines = [];
  for (const inlineScript of bundle.scripts.inline.values()) {
    if (inlineScript.type === 'module') {
      lines.push(`<script type="module">${inlineScript.src.trim()}</script>`);
    } else {
      lines.push(`<script>${inlineScript.src.trim()}</script>`);
    }
  }

  // If there are no modules, we can skip adding the 'nomodule' attribute to non-module scripts
  let hasModules = false;
  for (const script of [...bundle.scripts.sync.values(), ...bundle.scripts.async.values()]) {
    if (script.endsWith('.mjs')) {
      hasModules = true;
      break;
    }
  }

  for (const syncScript of bundle.scripts.sync.values()) {
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

  for (const asyncScript of bundle.scripts.async.values()) {
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

  if (bundle.styles.async.values().length > 0) {
    const asyncStyles = bundle.styles.async.values().map((style) => {
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