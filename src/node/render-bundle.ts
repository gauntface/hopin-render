import * as handlebars from 'handlebars';

import {Bundle} from './create-bundle';
import {renderHeadAssets} from './helpers/render-head-assets';
import {renderBodyAssets} from './helpers/render-body-assets';

export async function renderBundle(bundle: Bundle, data?: {}): Promise<string> {
  return bundle.template.render(data, {
    helpers: {
      'hopin_headAssets': () => renderHeadAssets(bundle),
      'hopin_bodyAssets': () => renderBodyAssets(bundle),
    },
  });
}
