import * as mustache  from 'mustache';

import { flattenTemplateBundle } from '../utils/flattenTemplateBundle';
import { revisionBundleAssets } from '../utils/revisionBundleAssets';
import { FlatBundle } from '../models/FlatBundle';
import { TemplateBundle } from '../models/TemplateBundle';

const renderTemplateBundle = async (templateBundle: TemplateBundle, data: object, config: {publicDir: string, revisionAssets: boolean}): Promise<string> => {
  let flatBundle: FlatBundle = await flattenTemplateBundle(templateBundle);
  if (config.revisionAssets) {
    flatBundle = await revisionBundleAssets(flatBundle, config);
  }

  return <string> mustache.render(
    flatBundle.mustacheString,
    {
      styles: flatBundle.styles,
      scripts: flatBundle.scripts,
      data,
    },
    flatBundle.partialMustacheStrings
  );
};

export {renderTemplateBundle};
