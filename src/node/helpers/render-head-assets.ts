import * as handlebars from 'handlebars';

import {Bundle} from '../create-bundle';

export function renderHeadAssets(bundle: Bundle) {
  const lines = [];
  for (const inlineStyle of bundle.styles.inline.values()) {
    lines.push(`<style>${handlebars.escapeExpression(inlineStyle.trim())}</style>`);
  }
  for (const syncStyle of bundle.styles.sync.values()) {
    lines.push(`<link rel="stylesheet" type="text/css" href="${handlebars.escapeExpression(syncStyle)}" />`);
  }
  return new handlebars.SafeString(lines.join('\n'));
}