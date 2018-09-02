import {createBundle, createBundleFromFile, Bundle} from './create-bundle';
import {renderBundle} from './render-bundle';
import { StylesAssetGroup } from './models/styles-assets-groups';
import { ScriptsAssetGroup } from './models/scripts-assets-groups';

export async function createTemplate(rawInput: string, relativePath?: string): Promise<HopinTemplate> {
  if (!relativePath) {
    relativePath = process.cwd();
  }
  const bundle = await createBundle(rawInput, relativePath);
  return new HopinTemplate(bundle);
}

export async function createTemplateFromFile(filePath: string): Promise<HopinTemplate> {
  const bundle = await createBundleFromFile(filePath);
  return new HopinTemplate(bundle);
}

export class HopinTemplate {
  private bundle: Bundle;

  constructor(bundle: Bundle) {
    this.bundle = bundle;
  }

  get styles(): StylesAssetGroup {
    return this.bundle.styles;
  }

  get scripts(): ScriptsAssetGroup {
    return this.bundle.scripts;
  }

  get yaml(): {} {
    return this.bundle.template.yaml;
  }

  render(data?: {}) {
    return renderBundle(this.bundle, data);
  }
}