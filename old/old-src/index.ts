import { generateTemplateBundle } from "./factory/generateTemplateBundle";
import { TemplateBundle } from "./models/TemplateBundle";
import { flattenTemplateBundle } from "./utils/flattenTemplateBundle";
import { retrieveInlineAssets } from './utils/retrieveInlineAssets';
import { revisionBundleAssets } from "./utils/revisionBundleAssets";
import { renderFlatBundle } from "./factory/renderFlatBundle";

const parseViewsToBundles = async (views: Array<object>, config: {
  partialsDir: string,
  publicDir: string,
  revisionAssets?: boolean,
}): Promise<Array<TemplateBundle>> => {
  let templateBundles = [];

  for (const viewDetails of views) {
    let contentBundles: Array<TemplateBundle> = [];
    if ((<any> viewDetails)['views']) {
      contentBundles = await parseViewsToBundles((<any> viewDetails)['views'], config);
    }

    const templateBundle = await generateTemplateBundle((<any> viewDetails)['viewPath'], contentBundles, (<any> viewDetails)['data'], config);
    templateBundles.push(templateBundle);
  }

  return templateBundles;
};

const renderShell = async ({
  shellPath,
  data = {},
  views = [],
  config,
}: {
  shellPath: string,
  data?: object,
  views?: Array<object>,
  config : {
    partialsDir: string,
    publicDir: string,
    revisionAssets?: boolean,
  },
}): Promise<string> => {
  // Parse views into content bundles
  const contentBundles = await parseViewsToBundles(views, config);

  // Create template bundle
  const templateBundle = await generateTemplateBundle(shellPath, contentBundles, data, config);

  // Flatten template Bundle
  let flatBundle = await flattenTemplateBundle(templateBundle);

  // Retrieve Inline Assets
  flatBundle = await retrieveInlineAssets(flatBundle, config);

  // Revision Other Assets
  flatBundle = await revisionBundleAssets(flatBundle, config);

  // Render Shell
  return renderFlatBundle(flatBundle);
};

export {renderShell};
