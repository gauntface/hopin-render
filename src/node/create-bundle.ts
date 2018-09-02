import * as path from 'path';
import * as fs from 'fs-extra';

import {StylesAssetGroup} from './models/styles-assets-groups';
import {ScriptsAssetGroup} from './models/scripts-assets-groups';
import {OrderedSet} from './models/ordered-set';
import {parseYaml} from './parse-yaml';
import {Template} from './template';

export async function createBundleFromFile(filePath: string): Promise<Bundle> {
  let fullPath = filePath;
  if (!path.isAbsolute(filePath)) {
    fullPath = path.resolve(filePath);
  }

  try {
    await fs.access(fullPath);
  } catch(err) {
    throw err;
  }

  const fileContents = await fs.readFile(fullPath);
  return createBundle(fileContents.toString(), path.dirname(fullPath));
}

export async function createBundle(rawYamlAndText: string, relativePath: string): Promise<Bundle> {
  // Retrieve shared assets and a template
  return await parseFile(rawYamlAndText, relativePath);
}

async function parseFile(rawYamlAndText: string, relativePath: string): Promise<Bundle> {
  const partials = new OrderedSet<Partial>();
  const styles = new StylesAssetGroup();
  const scripts = new ScriptsAssetGroup();

  const tmpBundle = parseYaml(rawYamlAndText, relativePath);
  styles.add(tmpBundle.styles);
  scripts.add(tmpBundle.scripts);

  for (const partialKey of Object.keys(tmpBundle.partials)) {
    const partialBundle = await createBundleFromFile(tmpBundle.partials[partialKey]);    
    partials.add(partialKey, {id: partialKey, template: partialBundle.template});
    styles.add(partialBundle.styles);
    scripts.add(partialBundle.scripts);
  }

  return {
    styles,
    scripts,
    template: new Template(tmpBundle.content, partials, tmpBundle.rawYaml),
  };
}

export interface Bundle {
  // The template is a tree node with child nodes
  template: Template|null;

  // These assets are assets that will bubble up the tree
  styles: StylesAssetGroup;
  scripts: ScriptsAssetGroup;
}

export interface Partial {
  id: string;
  template: Template;
}