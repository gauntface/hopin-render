import * as templateFactory from './template-factory';
import {HopinTemplate} from './models/hopin-template';
import { ComponentTemplate } from './models/component-template';

export function createHTMLTemplate(rawInput: string, relativePath?: string): HopinTemplate {
  if (!relativePath) {
      relativePath = process.cwd();
  }
  return templateFactory.createHopinTmplFromString(rawInput, relativePath);
}

export function createHTMLTemplateFromFile(filePath: string): HopinTemplate {
  return templateFactory.createHopinTmplFromFile(filePath);
}

export function createComponentTemplate(rawInput: string, relativePath?: string): ComponentTemplate {
  if (!relativePath) {
    relativePath = process.cwd();
  }
  return templateFactory.createCompTmplFromString(rawInput, relativePath);
}

export function createComponentTemplateFromFile(filePath: string): ComponentTemplate {
  return templateFactory.createCompTmplFromFile(filePath);
}

export {ComponentTemplate} from './models/component-template';
export {HopinTemplate} from './models/hopin-template';