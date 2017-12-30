import * as path from 'path';

import { TemplateBundle } from "../models/TemplateBundle";
import { AssetsGroup } from "../models/AssetsGroup";
import { parseViewFile } from "../utils/parseViewFile";

const createPartialBundles = async (partialPaths: Array<string>, relativePath: string, config: {
  publicDir: string,
  partialsDir: string,
}): Promise<Array<TemplateBundle>> => {
  const partialBundles: Array<TemplateBundle> = [];

  for (let partialPath of partialPaths) {
    const partialKey = partialPath;
    if (!path.isAbsolute(partialPath)) {
      partialPath = path.join(relativePath, partialPath);
    } else {
      partialPath = path.join(config.partialsDir, partialPath);
    }

    const partialBundle = await generateTemplateBundleWithId(
      partialPath,
      partialKey,
      config
    );
    partialBundles.push(partialBundle);
  }

  return partialBundles;
};

const generateTemplateBundleWithId = async (
  viewPath: string,
  id: string | null,
  config: {
    publicDir: string,
    partialsDir: string,
  }): Promise<TemplateBundle> => {
  const fileInfo = await parseViewFile(viewPath);

  const partialPaths = (<any> fileInfo.yaml)['partials'] || [];
  const partialBundles = await createPartialBundles(partialPaths, path.dirname(viewPath), config);

  return new TemplateBundle({
    id,
    mustacheString: fileInfo.contents,
    partialBundles,
    styles: new AssetsGroup((<any> fileInfo.yaml)['styles']),
    scripts: new AssetsGroup((<any> fileInfo.yaml)['scripts']),
  });
};

const generateTemplateBundle = async (
  viewPath: string,
  config: {
    publicDir: string,
    partialsDir: string,
  }): Promise<TemplateBundle> => {
  return generateTemplateBundleWithId(viewPath, null, config);
};

export {generateTemplateBundle};
