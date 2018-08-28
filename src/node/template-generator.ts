import * as matter from 'gray-matter';
import * as path from 'path';

import {OrderedSet} from './models/OrderedSet';

export async function generateTemplate(rawYamlAndText: string, relativePath?: string) {
  if (!relativePath) {
    relativePath = process.cwd();
  }

  const {yaml, rawText} = await seperateYamlAndText(rawYamlAndText, relativePath);
  console.log(yaml, rawText);
}

export async function seperateYamlAndText(rawYamlAndText: string, relativePath: string): Promise<{yaml: YAMLData, rawText: string}> {
  const parseFrontMatter = matter(rawYamlAndText);
  return {
    yaml: new YAMLData(parseFrontMatter.data, relativePath),
    rawText: parseFrontMatter.content.trim(),
  };
}

export class YAMLData {
  partials: OrderedSet<string>;
  styles: StylesAssetGroup;
  scripts: ScriptsAssetGroup;
  yaml: {};

  // tslint:disable-next-line: no-any
  constructor(data: any = {}, relativePath: string) {
    this.partials = new OrderedSet();
    this.styles = new StylesAssetGroup();
    this.scripts = new ScriptsAssetGroup();
    this.yaml = data;

    if (data.partials && Array.isArray(data.partials)) {
      for (const p of data.partials) {
        if (typeof p === 'string') {
          const absPath = path.resolve(relativePath, p);
          this.partials.add(absPath, absPath);
        }
      }
    }

    if (data.styles) {
      if (data.styles.inline && Array.isArray(data.styles.inline)) {
        for (const s of data.styles.inline) {
          if (typeof s === 'string') {
            const absPath = path.resolve(relativePath, s);
            this.styles.inline.add(absPath, absPath);
          }
        }
      }
      if (data.styles.sync && Array.isArray(data.styles.sync)) {
        for (const s of data.styles.sync) {
          if (typeof s === 'string') {
            const absPath = path.resolve(relativePath, s);
            this.styles.sync.add(absPath, absPath);
          }
        }
      }
      if (data.styles.async && Array.isArray(data.styles.async)) {
        for (const s of data.styles.async) {
          if (typeof s === 'string') {
            const absPath = path.resolve(relativePath, s);
            this.styles.async.add(absPath, absPath);
          }
        }
      }
    }

    if (data.scripts) {
      if (data.scripts.inline && Array.isArray(data.scripts.inline)) {
        for (let s of data.scripts.inline) {
          if (typeof s === 'string') {
            const absPath = path.resolve(relativePath, s);
            this.scripts.inline.add(absPath, {
              src: absPath,
              type: 'nomodule',
            });
          } else if (typeof s === 'object') {
            if (Object.keys(s).length === 1) {
              s = s[Object.keys(s)[0]];
            }
            if (s.src && s.type) {
              const absPath = path.resolve(relativePath, s.src);
              this.scripts.inline.add(absPath, {
                src: absPath,
                type: s.type,
              });
            }
          }
        }
      }
      if (data.scripts.sync && Array.isArray(data.scripts.sync)) {
        for (const s of data.scripts.sync) {
          if (typeof s === 'string') {
            const absPath = path.resolve(relativePath, s);
            this.scripts.sync.add(absPath, absPath);
          }
        }
      }
      if (data.scripts.async && Array.isArray(data.scripts.async)) {
        for (const s of data.scripts.async) {
          if (typeof s === 'string') {
            const absPath = path.resolve(relativePath, s);
            this.scripts.async.add(absPath, absPath);
          }
        }
      }
    }
  }
}

class StylesAssetGroup {
  inline: OrderedSet<string>;
  sync: OrderedSet<string>;
  async: OrderedSet<string>;

  constructor() {
    this.inline = new OrderedSet<string>();
    this.sync = new OrderedSet<string>();
    this.async = new OrderedSet<string>();
  }
}

class ScriptsAssetGroup {
  inline: OrderedSet<InlineScript>;
  sync: OrderedSet<string>;
  async: OrderedSet<string>;

  constructor() {
    this.inline = new OrderedSet<InlineScript>();
    this.sync = new OrderedSet<string>();
    this.async = new OrderedSet<string>();
  }
}

interface InlineScript {
  src: string;
  type: 'nomodule'|'module';
}