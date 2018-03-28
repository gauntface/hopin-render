import * as crypto from 'crypto';
import * as path from 'path';
import * as fs from 'fs-extra';

import { FlatBundle } from '../models/FlatBundle';

const revisionAssets = async (assets: Array<string>, publicDir: string): Promise<Array<string>> => {
  const revisionedAssets = [];

  for (const asset of assets) {
    const filePath = path.join(publicDir, asset);
    try {
      await fs.access(filePath);
      const contents = await fs.readFile(path.join(publicDir, asset));
      const hash = crypto.createHash('md5')
        .update(contents).digest('hex').substring(0, 8);
      const extension = path.extname(filePath);
      const revisionedUrl = path.join(
        path.dirname(asset),
        `${path.basename(asset, extension)}.${hash}${extension}`
      );
      revisionedAssets.push(revisionedUrl);
    } catch (err) {
      revisionedAssets.push(asset);
    }
  }
  return revisionedAssets;
};

const revisionBundleAssets = async (flatBundle: FlatBundle, config: {publicDir: string}) => {
  flatBundle.styles.sync = await revisionAssets(flatBundle.styles.sync, config.publicDir);
  flatBundle.styles.async = await revisionAssets(flatBundle.styles.async, config.publicDir);
  flatBundle.scripts.sync = await revisionAssets(flatBundle.scripts.sync, config.publicDir);
  flatBundle.scripts.async = await revisionAssets(flatBundle.scripts.async, config.publicDir);
  return flatBundle;
}

export {revisionBundleAssets};
