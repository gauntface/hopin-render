import * as mustache  from 'mustache';

import { flattenTemplateBundle } from '../utils/flattenTemplateBundle';
import { revisionBundleAssets } from '../utils/revisionBundleAssets';
import { FlatBundle } from '../models/FlatBundle';
import { TemplateBundle } from '../models/TemplateBundle';

const renderTemplateBundle = async (templateBundle: TemplateBundle, config: {publicDir: string, revisionAssets: boolean}): Promise<string> => {
  let flatBundle: FlatBundle = await flattenTemplateBundle(templateBundle);
  if (config.revisionAssets) {
    flatBundle = await revisionBundleAssets(flatBundle, config);
  }

  return <string> mustache.render(
    flatBundle.mustacheString,
    {
      content: () => {
        return 'Hello';
      },
      styles: flatBundle.styles,
      scripts: flatBundle.scripts,
      data: {
        // TODO: This needs to come from the bundle
      },
    },
    flatBundle.partialMustacheStrings
  );
};

export {renderTemplateBundle};
