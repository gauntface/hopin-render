import * as handlebars from 'handlebars';

import { BaseTemplate } from "./base-template";
import { HopinTemplate } from "./hopin-template";
import {renderComponent} from '../helpers/render-component';
import { StylesAssetGroup } from './styles-assets-groups';
import { ScriptsAssetGroup } from './scripts-assets-groups';

export class ComponentTemplate extends BaseTemplate {
  
  appendStyles(s: StylesAssetGroup) {
    this._styles.append(s);
  }

  appendScripts(s: ScriptsAssetGroup) {
    this._scripts.add(s);
  }

  protected getHandlebars(): typeof handlebars {
    const handlebarsInstance = super.getHandlebars();

    handlebarsInstance.registerHelper('hopin_loadComponent', (...args) => renderComponent(this, ...args));

    return handlebarsInstance;
  }

  render(): ComponentBundle {
    const handlebarsInstance = this.getHandlebars();
    const handlebarsTemplate = handlebarsInstance.compile(this.content);
    const mergedTemplateData = {yaml: this.yaml};
    const render = handlebarsTemplate(mergedTemplateData);
    return {
      renderedTemplate: render,
      styles: this._styles,
      scripts: this._scripts,
    };
  }
}

export interface ComponentBundle {
  renderedTemplate: string;
  styles: StylesAssetGroup;
  scripts: ScriptsAssetGroup;
}