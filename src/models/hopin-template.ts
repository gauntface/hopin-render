import * as handlebars from 'handlebars';

import { BaseTemplate } from './base-template';
import { ScriptsAssetGroup } from "./scripts-assets-groups";
import { StylesAssetGroup } from "./styles-assets-groups";
import {HopinYaml} from '../parse-yaml';
import { renderHeadAssets } from '../helpers/render-head-assets';
import { renderBodyAssets } from '../helpers/render-body-assets';
import { ComponentBundle } from './component-template';

export class HopinTemplate extends BaseTemplate {

  get styles(): StylesAssetGroup {
    return this._styles;
  }
  
  get scripts(): ScriptsAssetGroup {
    return this._scripts;
  }

  protected getHandlebars(): typeof handlebars {
    const handlebarsInstance = super.getHandlebars();
    handlebarsInstance.registerHelper('hopin_headAssets', () => renderHeadAssets(this));
    handlebarsInstance.registerHelper('hopin_bodyAssets', () => renderBodyAssets(this));
    return handlebarsInstance;
  }

  render(cmp?: ComponentBundle) {
    const handlebarsInstance = this.getHandlebars();
    const handlebarsTemplate = handlebarsInstance.compile(this.content);
    const mergedTemplateData: Data = {yaml: this.yaml};
    if (cmp) {
      this._styles.append(cmp.styles);
      this._scripts.add(cmp.scripts);
      mergedTemplateData.content = cmp.renderedTemplate;
    }
    return handlebarsTemplate(mergedTemplateData);
  }
}

interface Data {
  yaml: {};
  content?: string;
}