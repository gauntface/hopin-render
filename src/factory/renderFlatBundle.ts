import * as mustache  from 'mustache';

import { flattenTemplateBundle } from '../utils/flattenTemplateBundle';
import { revisionBundleAssets } from '../utils/revisionBundleAssets';
import { FlatBundle } from '../models/FlatBundle';
import { TemplateBundle } from '../models/TemplateBundle';

const renderFlatBundle = async (flatBundle: FlatBundle): Promise<string> => {
  // let flatBundle: FlatBundle = await flattenTemplateBundle(templateBundle);

  return <string> mustache.render(
    flatBundle.mustacheString,
    {
      content: () => {
        return 'Hello';
      },
      styles: flatBundle.styles,
      scripts: flatBundle.scripts,
      data: flatBundle.data,
    },
    flatBundle.partialMustacheStrings
  );
};

export {renderFlatBundle};
