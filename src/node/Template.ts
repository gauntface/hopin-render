import * as handlebars from 'handlebars';
import * as matter from 'gray-matter';
import * as fs from 'fs-extra';
import * as path from 'path';

import { compileFile } from '.';
import {logger} from "./utils/logger";

interface RenderOptions {
  styles?: {
    inline?: string[];
    sync?: string[];
    async?: string[];
  };
  scripts?: {
    inline?: string[];
    sync?: string[];
    async?: string[];
  };
}

interface AssetGroup {
  inline: Set<string>;
  sync: Set<string>;
  async: Set<string>;
}

interface YamlData {
  partials: string[];
  styles: AssetGroup;
  scripts: AssetGroup;
  data: object;
}

interface PartialMap {
  [partialName: string]: Template;
}

interface Compilation {
  partials: PartialMap;
  styles: AssetGroup;
  scripts: AssetGroup;
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

    const compilation = {
      partials,
      styles: await this.loadAssetGroup(this.yaml.styles),
      scripts: await this.loadAssetGroup(this.yaml.scripts),
    };

    // We need to get all of the partial styles and scripts
    for (const partialKey of Object.keys(partials)) {
      const compiledPartial = await partials[partialKey].compile();
      for (const inlineStyle of Array.from(compiledPartial.styles.inline)) {
        compilation.styles.inline.add(inlineStyle);
      }
      for (const syncStyle of Array.from(compiledPartial.styles.sync)) {
        compilation.styles.sync.add(syncStyle);
      }
      for (const asyncStyle of Array.from(compiledPartial.styles.async)) {
        compilation.styles.async.add(asyncStyle);
      }

      for (const inlineScript of Array.from(compiledPartial.scripts.inline)) {
        compilation.scripts.inline.add(inlineScript);
      }
      for (const syncScript of Array.from(compiledPartial.scripts.sync)) {
        compilation.scripts.sync.add(syncScript);
      }
      for (const asyncScript of Array.from(compiledPartial.scripts.async)) {
        compilation.scripts.async.add(asyncScript);
      }
    }

    return compilation;
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

  private async loadAssetGroup(group: AssetGroup|undefined): Promise<AssetGroup> {
    if (!group) {
      return {
        inline: new Set<string>(),
        sync: new Set<string>(),
        async: new Set<string>(),
      };
    }

    return {
      inline: await this.loadInlineAssets(group.inline),
      sync: this.loadDirectAssets(group.sync),
      async: this.loadDirectAssets(group.async),
    };
  }

  private async loadInlineAssets(assets: Set<string>|undefined): Promise<Set<string>> {
    if (!assets) {
      return new Set<string>();
    }

    // Convert to absolute paths, use a set to de-dupe assets
    const absPathAssets = new Set<string>();
    for (const assetPath of Array.from(assets)) {
      let absPath = assetPath;
      if (!path.isAbsolute(absPath)) {
        absPath = path.join(this.relativePath, absPath);
      }
      absPathAssets.add(absPath);
    }

    // Get all of the asset file contents
    const assetContents = await Promise.all(Array.from(absPathAssets).map(async (assetPath) => {
      const pathBuffer = await fs.readFile(assetPath);
      return pathBuffer.toString();
    }));
    return new Set<string>(assetContents);
  }

  private loadDirectAssets(assets: Set<string>|undefined): Set<string> {
    if (!assets) {
      return new Set<string>();
    }

    // Use a set to de-dupe assets
    return new Set(assets);
  }

  async render(data?: object, opts?: RenderOptions) {
    const handlebarsInstance = handlebars.create();

    const compilation = await this.compile();

    for (const partialName of Object.keys(compilation.partials)) {
      const template = compilation.partials[partialName];
      const renderedPartial = await template.render(data);
      handlebarsInstance.registerPartial(partialName, renderedPartial);
    }

    if (opts) {
      if (opts.styles) {
        if (opts.styles.inline) {
          for (const style of opts.styles.inline) {
            compilation.styles.inline.add(style);
          }
        }
        if (opts.styles.sync) {
          for (const style of opts.styles.sync) {
            compilation.styles.sync.add(style);
          }
        }
        if (opts.styles.async) {
          for (const style of opts.styles.async) {
            compilation.styles.async.add(style);
          }
        }
      }

      if (opts.scripts) {
        if (opts.scripts.inline) {
          for (const script of opts.scripts.inline) {
            compilation.scripts.inline.add(script);
          }
        }
        if (opts.scripts.sync) {
          for (const script of opts.scripts.sync) {
            compilation.scripts.sync.add(script);
          }
        }
        if (opts.scripts.async) {
          for (const script of opts.scripts.async) {
            compilation.scripts.async.add(script);
          }
        }
      }
    }

    handlebarsInstance.registerHelper('hopin_headAssets', () => {
      let result = '';
      for (const inlineStyle of compilation.styles.inline) {
        result += `<style>${handlebars.escapeExpression(inlineStyle.trim())}</style>\n`;
      }
      for (const syncStyle of compilation.styles.sync) {
        result += `<link rel="stylesheet" type="text/css" href="${handlebars.escapeExpression(syncStyle)}" />\n`;
      }
      return new handlebars.SafeString(result);
    });

    handlebarsInstance.registerHelper('hopin_bodyAssets', () => {
      return '';
    });

    const handlebarsTemplate = handlebarsInstance.compile(this.template);
    return handlebarsTemplate({
      data,
      hopin: {
        styles: {
          inline: Array.from(compilation.styles.inline),
          sync: Array.from(compilation.styles.sync),
          async: Array.from(compilation.styles.async),
        },
        scripts: {
          inline: Array.from(compilation.scripts.inline),
          sync: Array.from(compilation.scripts.sync),
          async: Array.from(compilation.scripts.async),
        },
      },
      yaml: this.yaml,
    });
  }
}

export async function generateTemplate(template: string, relativePath?: string): Promise<Template> {
  return new Template(template, relativePath);
}
