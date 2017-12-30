import { TemplateBundle } from '../models/TemplateBundle';
import { FlatBundle } from '../models/FlatBundle';
import { AssetsGroup } from '../models/AssetsGroup';

const traverseTree = async (rootBundle: TemplateBundle, cumulativeDetails: {styles: AssetsGroup, scripts: AssetsGroup, partialMustacheStrings: object}) => {
  const childBundles = rootBundle.partialBundles;
  for (const childBundle of childBundles) {
    if (childBundle.id) {
      const partialKey = <string> childBundle.id;
      (<any> cumulativeDetails.partialMustacheStrings)[partialKey] = childBundle.mustacheString;

      cumulativeDetails.styles.merge(childBundle.styles);
      cumulativeDetails.scripts.merge(childBundle.scripts);
    }

    traverseTree(childBundle, cumulativeDetails);
  }
};

const flattenTemplateBundle = async (templateBundle: TemplateBundle): Promise<FlatBundle> => {
  const cumulativeDetails = {
    styles: templateBundle.styles,
    scripts: templateBundle.scripts,
    partialMustacheStrings: {},
  };

  await traverseTree(templateBundle, cumulativeDetails);

  return new FlatBundle({
    mustacheString: templateBundle.mustacheString,
    styles: cumulativeDetails.styles,
    scripts: cumulativeDetails.scripts,
    partialMustacheStrings: cumulativeDetails.partialMustacheStrings,
  });
};

export {flattenTemplateBundle};
