import * as fs from 'fs-extra';
import * as path from 'path';
import {FlatBundle} from '../models/FlatBundle';

const readInlineAssets = async (assets: Array<string>, publicDir: string): Promise<Array<string>> => {
  const assetContents: Array<string> = [];
  for(let asset of assets) {
    // TODO: Does it make sense to allow relative paths for assets?
    const contentBuffer = await fs.readFile(path.join(publicDir, asset));
    assetContents.push(contentBuffer.toString().trim());
  }
  return assetContents;
}

const retrieveInlineAssets = async (flatBundle: FlatBundle, config: {publicDir: string}): Promise<FlatBundle> => {
  flatBundle.styles.inline = await readInlineAssets(flatBundle.styles.inline, config.publicDir);
  flatBundle.scripts.inline = await readInlineAssets(flatBundle.scripts.inline, config.publicDir);

  return flatBundle;
}

export {retrieveInlineAssets};
