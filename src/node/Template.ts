import * as handlebars from 'handlebars';
import * as matter from 'gray-matter';
import * as fs from 'fs-extra';
import * as path from 'path';

import { compileFile } from '.';
import {logger} from "./utils/logger";

interface AssetGroup {
  inline?: string[];
}

interface YamlData {
  partials: string[];
  styles: AssetGroup;
  data: object;
}

interface PartialMap {
  [partialName: string]: Template;
}

interface Compilation {
  partials: PartialMap;
  styles: AssetGroup;
}

export class Template {
  private relativePath: string;
  private template: string;
  private yaml: YamlData | null;

  constructor(template: string, relativePath?: string) {
    const parseFrontMatter = matter(template);

    this.relativePath = relativePath || process.cwd();
    this.template = parseFrontMatter.content;
    this.yaml = parseFrontMatter.data as YamlData | null;
  }

  private async compile(): Promise<Compilation> {
    const partials = await this.loadPartials();

    // TODO Load and dedupe styles
    // TODO Load and dedupe scripts
    const styles = await this.loadStyles();

    return {
      partials,
      styles,
    };
  }

  private async loadPartials(): Promise<PartialMap> {
    if (!this.yaml.partials) {
      return {};
    }

    if (!Array.isArray(this.yaml.partials)) {
      throw new Error('The \'partials\' yaml field should be a list of strings ' +
      `but found '${typeof this.yaml.partials}' instead.`);
    }

    const partials: PartialMap = {};
    for (const partialPath of this.yaml.partials) {
      if (typeof partialPath !== 'string') {
        throw new Error('Found a partial that is not a string: ' +
          `'${partialPath}'`);
      }

      let absPath = partialPath;
      if (!path.isAbsolute(partialPath)) {
        absPath = path.join(this.relativePath, partialPath);
      }

      const template = await compileFile(absPath);
      partials[partialPath] = template;
    }
    return partials;
  }

  private async loadStyles(): Promise<AssetGroup> {
    if (!this.yaml.styles) {
      return {};
    }

    // Get list of partials, get styles etc from them before reading in the
    // current files
    const inlineStyles = await this.loadInlineAssets(this.yaml.styles.inline);
    return {
      inline: inlineStyles,
    };
  }

  private async loadInlineAssets(assets: string[]): Promise<string[]> {
    if (!assets) {
      return [];
    }

    const assetContents = await Promise.all(assets.map(async (assetPath) => {
      let absPath = assetPath;
      if (!path.isAbsolute(absPath)) {
        absPath = path.join(this.relativePath, absPath);
      }

      const pathBuffer = await fs.readFile(absPath);
      return pathBuffer.toString();
    }));
    return assetContents;
  }

  async render(data?: object) {
    const handlebarsInstance = handlebars.create();

    const compilation = await this.compile();

    for (const partialName of Object.keys(compilation.partials)) {
      const template = compilation.partials[partialName];
      const renderedPartial = await template.render(data);
      handlebarsInstance.registerPartial(partialName, renderedPartial);
    }

    const handlebarsTemplate = handlebarsInstance.compile(this.template);
    return handlebarsTemplate({
      data,
      hopin: {
        styles: compilation.styles,
      },
      yaml: this.yaml,
    });
  }
}

export async function generateTemplate(template: string, relativePath?: string): Promise<Template> {
  return new Template(template, relativePath);
}
