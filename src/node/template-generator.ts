

import { Template } from './template';
import {createBundle, createBundleFromFile, Bundle} from './create-bundle';

export async function generateTemplate(rawYamlAndText: string, relativePath?: string): Promise<Template> {
  if (!relativePath) {
    relativePath = process.cwd();
  }
  const bundle = await createBundle(rawYamlAndText, relativePath);
  return bundle.template;
}

export async function generateTemplateFromFile(filePath: string) {
  const bundle = await createBundleFromFile(filePath);
  return bundle.template;
}