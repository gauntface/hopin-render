import * as handlebars from 'handlebars';

import {limitArray} from '../helpers/limit-array';
import { HopinTemplate } from './hopin-template';
import {HopinYaml} from '../parse-yaml';
import { ScriptsAssetGroup } from "./scripts-assets-groups";
import { StylesAssetGroup } from "./styles-assets-groups";

export class BaseTemplate {
  private relPath: string;
  private _content: string;
  private _yaml: {};
  protected _styles: StylesAssetGroup;
  protected _scripts: ScriptsAssetGroup;
  protected _elements: string[];

  constructor(relPath: string, hopinYaml: HopinYaml) {
    this.relPath = relPath;
    this._content = hopinYaml.content;
    this._yaml = hopinYaml.rawYaml;
    this._styles = hopinYaml.styles;
    this._scripts = hopinYaml.scripts;
    this._elements = hopinYaml.elements;
  }

  get relativePath(): string {
    return this.relPath;
  }

  get content(): string {
    return this._content;
  }

  get yaml(): {} {
    return this._yaml;
  }

  protected getHandlebars(): typeof handlebars {
    const handlebarsInstance = handlebars.create();

    handlebarsInstance.registerHelper('hopin_limitArray', limitArray);

    return handlebarsInstance;
  }
}