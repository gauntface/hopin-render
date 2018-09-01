import {createBundle, createBundleFromFile, Bundle} from './create-bundle';
import {renderBundle} from './render-bundle';

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

  constructor(bundle) {
    this.bundle = bundle;
  }

  render(data: {}) {
    return renderBundle(this.bundle, data);
  }
}