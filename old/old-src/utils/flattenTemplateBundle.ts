import { TemplateBundle } from '../models/TemplateBundle';
import { FlatBundle } from '../models/FlatBundle';
import { AssetsGroup } from '../models/AssetsGroup';
import { renderFlatBundle } from '../factory/renderFlatBundle';

const traverseTree = async (rootBundle: TemplateBundle, cumulativeDetails: {styles: AssetsGroup, scripts: AssetsGroup, partialMustacheStrings: object, contentStrings: Array<string>}) => {
  const childPartialBundles = rootBundle.partialBundles;
  for (const childBundle of childPartialBundles) {
    if (childBundle.id) {
      const partialKey = <string> childBundle.id;
      (<any> cumulativeDetails.partialMustacheStrings)[partialKey] = childBundle.mustacheString;

      cumulativeDetails.styles.merge(childBundle.styles);
      cumulativeDetails.scripts.merge(childBundle.scripts);
    }

    traverseTree(childBundle, cumulativeDetails);
  }

  const childContentBundles = rootBundle.contentBundles;
  for (const childBundle of childContentBundles) {
    const flatChild = await flattenTemplateBundle(childBundle);
    const renderedContent = await renderFlatBundle(flatChild);
    cumulativeDetails.contentStrings.push(renderedContent);

    flatChild.styles.raw.forEach((value) => {
      cumulativeDetails.styles.raw.add(value);
    });
    flatChild.styles.inline.forEach((value) => {
      cumulativeDetails.styles.inline.add(value);
    });
    flatChild.styles.sync.forEach((value) => {
      cumulativeDetails.styles.sync.add(value);
    });
    flatChild.styles.async.forEach((value) => {
      cumulativeDetails.styles.async.add(value);
    });

    flatChild.scripts.raw.forEach((value) => {
      cumulativeDetails.scripts.raw.add(value);
    });
    flatChild.scripts.inline.forEach((value) => {
      cumulativeDetails.scripts.inline.add(value);
    });
    flatChild.scripts.sync.forEach((value) => {
      cumulativeDetails.scripts.sync.add(value);
    });
    flatChild.scripts.async.forEach((value) => {
      cumulativeDetails.scripts.async.add(value);
    });
  }
};

const flattenTemplateBundle = async (templateBundle: TemplateBundle): Promise<FlatBundle> => {
  const cumulativeDetails = {
    styles: templateBundle.styles,
    scripts: templateBundle.scripts,
    partialMustacheStrings: {},
    contentStrings: [],
  };

  await traverseTree(templateBundle, cumulativeDetails);

  return new FlatBundle({
    mustacheString: templateBundle.mustacheString,
    styles: cumulativeDetails.styles,
    scripts: cumulativeDetails.scripts,
    partialMustacheStrings: cumulativeDetails.partialMustacheStrings,
    contentStrings: cumulativeDetails.contentStrings,
    data: templateBundle.data,
  });
};

export {flattenTemplateBundle};
