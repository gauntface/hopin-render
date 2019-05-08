import * as handlebars from 'handlebars';

import { HopinTemplate } from '../models/hopin-template';

export function renderHeadAssets(tmpl: HopinTemplate) {
  const lines = [];
  for (const inlineStyle of tmpl.styles.inline.values()) {
    lines.push(`<style>${inlineStyle.trim()}</style>`);
  }
  for (const syncStyle of tmpl.styles.sync.values()) {
    lines.push(`<link rel="stylesheet" type="text/css" href="${handlebars.escapeExpression(syncStyle)}" />`);
  }
  return new handlebars.SafeString(lines.join('\n'));
}