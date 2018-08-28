import {YAMLData} from './template-generator';

export class Template {
  yaml: YAMLData;
  private rawText: string;

  constructor(yaml: YAMLData, rawText: string) {
    this.yaml = yaml;
    this.rawText = rawText;
  }

  render() {
    // 1. Collect all yaml

    // 2. pass this templates text along with all yaml to renderer

    // 3. return result
  }
}
/*
import * as handlebars from 'handlebars';

import * as fs from 'fs-extra';
import * as path from 'path';
import {renderMarkdown} from '@hopin/markdown';

import { compileFile } from './index-old';
import {OrderedSet} from './models/OrderedSet';
import {logger} from "./utils/logger";


export class Template {
  private relativePath: string;
  private template: string;
  private yaml: YamlData;

  constructor(template: string, relativePath?: string) {
    this.relativePath = relativePath || process.cwd();
    this.yaml = this.convertYamlData(rawYamlData);
  }

  private async compile(): Promise<Compilation> {
    const partials = await this.loadPartials();

    const compilation = {
      partials,
      styles: await this.loadStylesAssetGroup(this.yaml.styles),
      scripts: await this.loadScriptsAssetGroup(this.yaml.scripts),
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

      for (const inlineScript of compiledPartial.scripts.inline.data()) {
        compilation.scripts.inline.add(inlineScript.path, inlineScript.value);
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

  

  private async loadStylesAssetGroup(group: StylesAssetGroup): Promise<StylesAssetGroup> {
    return {
      inline: await this.loadInlineAssets(group.inline),
      sync: this.loadDirectAssets(group.sync),
      async: this.loadDirectAssets(group.async),
    };
  }

  private async loadScriptsAssetGroup(group: ScriptsAssetGroup): Promise<ScriptsAssetGroup> {
    return {
      inline: await this.loadInlineScriptAssets(group.inline),
      sync: this.loadDirectAssets(group.sync),
      async: this.loadDirectAssets(group.async),
    };
  }

  private async loadInlineScriptAssets(assets: OrderedSet<InlineScript>): Promise<OrderedSet<InlineScript>> {
    // Convert to absolute paths, use a set to de-dupe assets
    const absPathAssets = new OrderedSet<InlineScript>();
    for (const asset of assets.values()) {
      let absPath = asset.src;
      if (!path.isAbsolute(absPath)) {
        absPath = path.join(this.relativePath, absPath);
      }
      absPathAssets.add(absPath, {src: absPath, type: asset.type});
    }

    // Get all of the asset file contents
    const assetContents = new OrderedSet<InlineScript>();
    for (const asset of absPathAssets.values()) {
      const pathBuffer = await fs.readFile(asset.src);
      assetContents.add(asset.src, {src: pathBuffer.toString(), type: asset.type});
    }
    return assetContents;
  }

  private async loadInlineAssets(assets: Set<string>): Promise<Set<string>> {
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

  private loadDirectAssets(assets: Set<string>): Set<string> {
    // Use a set to de-dupe assets
    return new Set(assets);
  }

  async render(data?: object, opts?: RawYamlData) {
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
            if (typeof script === 'string') {
              compilation.scripts.inline.add(script, {src: script, type: 'nomodule'});
            } else {
              compilation.scripts.inline.add(script.src, script);
            }
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
      const lines = [];
      for (const inlineStyle of compilation.styles.inline) {
        lines.push(`<style>${handlebars.escapeExpression(inlineStyle.trim())}</style>`);
      }
      for (const syncStyle of compilation.styles.sync) {
        lines.push(`<link rel="stylesheet" type="text/css" href="${handlebars.escapeExpression(syncStyle)}" />`);
      }
      return new handlebars.SafeString(lines.join('\n'));
    });

    handlebarsInstance.registerHelper('hopin_bodyAssets', () => {
      // async styles
      const lines = [];
      for (const inlineScript of compilation.scripts.inline.values()) {
        if (inlineScript.type === 'module') {
          lines.push(`<script type="module">${handlebars.escapeExpression(inlineScript.src.trim())}</script>`);
        } else {
          lines.push(`<script>${handlebars.escapeExpression(inlineScript.src.trim())}</script>`);
        }
      }

      let hasModules = false;
      for (const script of [...compilation.scripts.sync, ...compilation.scripts.async]) {
        if (script.endsWith('.mjs')) {
          hasModules = true;
          break;
        }
      }

      for (const syncScript of compilation.scripts.sync) {
        const attributes = [
          `src="${handlebars.escapeExpression(syncScript)}"`,
        ];
        if (hasModules) {
          if (syncScript.endsWith('.mjs')) {
            attributes.push('type="module"');
          } else {
            attributes.push('nomodule');
          }
        }
        lines.push(`<script ${attributes.join(' ')}></script>`);
      }

      for (const asyncScript of compilation.scripts.async) {
        const attributes = [
          `src="${handlebars.escapeExpression(asyncScript)}"`,
          'async',
          'defer',
        ];
        if (hasModules) {
          if (asyncScript.endsWith('.mjs')) {
            attributes.push('type="module"');
          } else {
            attributes.push('nomodule');
          }
        }
        lines.push(`<script ${attributes.join(' ')}></script>`);
      }

      if (compilation.styles.async.size > 0) {
        const asyncStyles = Array.from(compilation.styles.async).map((style) => {
          return `'${style}'`;
        }).join(',');
        lines.push(`<script>
window.addEventListener('load', function() {
  var __hopin_async_styles = [${asyncStyles}];
  for(var i = 0; i < __hopin_async_styles.length; i++) {
    var linkTag = document.createElement('link');
    linkTag.rel = 'stylesheet';
    linkTag.href = __hopin_async_styles[i];
    document.head.appendChild(linkTag);
  }
});
</script>`);
      }

      return new handlebars.SafeString(lines.join('\n'));
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
          inline: compilation.scripts.inline.values(),
          sync: Array.from(compilation.scripts.sync),
          async: Array.from(compilation.scripts.async),
        },
      },
      yaml: this.yaml.rawYaml,
    });
  }
}

export class MarkdownTemplate extends Template {
  async render(data?: object, opts?: RawYamlData) {
    const renderedString = await super.render(data, opts);
    const result = await renderMarkdown(renderedString);
    // TODO: How to add additional styles based on the parsed markdown??
    return result.html;
  }
}

export async function generateTemplate(template: string, relativePath?: string): Promise<Template> {
  return new Template(template, relativePath);
}

export async function generateMarkdownTemplate(template: string, relativePath?: string): Promise<Template> {
  return new MarkdownTemplate(template, relativePath);
}*/