import * as mustache  from 'mustache';
import {EOL} from 'os';

import { flattenTemplateBundle } from '../utils/flattenTemplateBundle';
import { revisionBundleAssets } from '../utils/revisionBundleAssets';
import { FlatBundle } from '../models/FlatBundle';
import { TemplateBundle } from '../models/TemplateBundle';

const renderFlatBundle = async (flatBundle: FlatBundle): Promise<string> => {
  return <string> mustache.render(
    flatBundle.mustacheString,
    {
      content: () => {
        return flatBundle.contentStrings.join(EOL);
      },
      styles: flatBundle.styles,
      scripts: flatBundle.scripts,
      data: flatBundle.data,
    },
    flatBundle.partialMustacheStrings
  ).trim();
};

export {renderFlatBundle};
