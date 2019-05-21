import * as path from 'path';
import * as fs from 'fs-extra';

import {StylesAssetGroup} from './models/styles-assets-groups';
import {ScriptsAssetGroup} from './models/scripts-assets-groups';
import {parseYaml} from './parse-yaml';
import {HopinTemplate} from './models/hopin-template';
import { ComponentTemplate } from './models/component-template';

export function createHopinTmplFromFile(filePath: string): HopinTemplate {
  let fullPath = filePath;
  if (!path.isAbsolute(filePath)) {
    fullPath = path.resolve(filePath);
  }

  fs.accessSync(fullPath);

  const fileContents = fs.readFileSync(fullPath);
  return createHopinTmplFromString(fileContents.toString(), path.dirname(fullPath));
}

export function createHopinTmplFromString(rawYamlAndText: string, relativePath: string): HopinTemplate {
  // Retrieve shared assets and a template
  const hopinyaml = parseYaml(rawYamlAndText, relativePath);
  return new HopinTemplate(relativePath, hopinyaml);
}

export function createCompTmplFromFile(filePath: string): ComponentTemplate {
  let fullPath = filePath;
  if (!path.isAbsolute(filePath)) {
    fullPath = path.resolve(filePath);
  }

  fs.accessSync(fullPath);

  const fileContents = fs.readFileSync(fullPath);
  return createCompTmplFromString(fileContents.toString(), path.dirname(fullPath));
}

export function createCompTmplFromString(rawYamlAndText: string, relativePath: string): ComponentTemplate {
  // Retrieve shared assets and a template
  const hopinyaml = parseYaml(rawYamlAndText, relativePath);
  return new ComponentTemplate(relativePath, hopinyaml);
}