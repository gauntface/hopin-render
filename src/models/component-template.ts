import * as handlebars from 'handlebars';

import { BaseTemplate } from "./base-template";
import {loadComponent} from '../helpers/load-component';
import { StylesAssetGroup } from './styles-assets-groups';
import { ScriptsAssetGroup } from './scripts-assets-groups';

export class ComponentTemplate extends BaseTemplate {
  
  appendStyles(s: StylesAssetGroup) {
    this._styles.append(s);
  }

  appendScripts(s: ScriptsAssetGroup) {
    this._scripts.add(s);
  }

  appendElements(e: string[]) {
    this._elements.push(...e);
  }

  protected getHandlebars(): typeof handlebars {
    const handlebarsInstance = super.getHandlebars();

    handlebarsInstance.registerHelper('hopin_loadComponent', (...args) => loadComponent(this, ...args));

    return handlebarsInstance;
  }

  render(toplevelData?: {}): ComponentBundle {
    const handlebarsInstance = this.getHandlebars();
    const handlebarsTemplate = handlebarsInstance.compile(this.content);
    const mergedTemplateData = Object.assign({yaml: this.yaml}, toplevelData);
    const render = handlebarsTemplate(mergedTemplateData);
    return {
      renderedTemplate: render,
      styles: this._styles,
      scripts: this._scripts,
      elements: this._elements,
    };
  }
}

export interface ComponentBundle {
  renderedTemplate: string;
  styles: StylesAssetGroup;
  scripts: ScriptsAssetGroup;
  elements: string[];
}