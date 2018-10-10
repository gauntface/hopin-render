import * as handlebars from 'handlebars';

import {Bundle} from './create-bundle';
import {renderHeadAssets} from './helpers/render-head-assets';
import {renderBodyAssets} from './helpers/render-body-assets';
import { RenderOpts } from '.';

export async function renderBundle(bundle: Bundle, opts?: RenderOpts): Promise<string> {
  return bundle.template.render(opts, {
    helpers: {
      'hopin_headAssets': () => renderHeadAssets(bundle),
      'hopin_bodyAssets': () => renderBodyAssets(bundle),
    },
  });
}
