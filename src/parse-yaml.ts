import * as path from 'path';
import * as fs from 'fs-extra';
import * as matter from 'gray-matter';

import { OrderedSet } from './models/ordered-set';
import {StylesAssetGroup} from './models/styles-assets-groups';
import {ScriptsAssetGroup} from './models/scripts-assets-groups';

export function parseYaml(rawYamlAndText: string, relativePath: string): HopinYaml {
  const parseFrontMatter = matter(rawYamlAndText);
  // tslint:disable-next-line:no-any
  const rawYaml = parseFrontMatter.data as any;
  const content = parseFrontMatter.content.trim();

  const styles = new StylesAssetGroup();
  const scripts = new ScriptsAssetGroup();
  const elements: string[] = [];

  if (rawYaml['styles']) {
    if (rawYaml['styles'].inline && Array.isArray(rawYaml['styles'].inline)) {
      for (const s of rawYaml['styles'].inline) {
        if (typeof s === 'string') {
          const absPath = path.resolve(relativePath, s);
          const buffer = fs.readFileSync(absPath);
          styles.inline.add(absPath, buffer.toString());
        }
      }
    }
    if (rawYaml['styles'].sync && Array.isArray(rawYaml['styles'].sync)) {
      for (const s of rawYaml['styles'].sync) {
        if (typeof s === 'string') {
          styles.sync.add(s, s);
        }
      }
    }
    if (rawYaml['styles'].async && Array.isArray(rawYaml['styles'].async)) {
      for (const s of rawYaml['styles'].async) {
        if (typeof s === 'string') {
          styles.async.add(s, s);
        }
      }
    }
  }

  if (rawYaml['scripts']) {
    if (rawYaml['scripts'].inline && Array.isArray(rawYaml['scripts'].inline)) {
      for (let s of rawYaml['scripts'].inline) {
        if (typeof s === 'string') {
          const absPath = path.resolve(relativePath, s);
          const buffer = fs.readFileSync(absPath);
          scripts.inline.add(absPath, {
            src: buffer.toString(),
            type: path.extname(absPath) === '.mjs' ? 'module' : 'nomodule',
          });
        } else if (typeof s === 'object') {
          if (Object.keys(s).length === 1) {
            s = s[Object.keys(s)[0]];
          }
          if (s.src && s.type) {
            const absPath = path.resolve(relativePath, s.src);
            const buffer = fs.readFileSync(absPath);
            scripts.inline.add(absPath, {
              src: buffer.toString(),
              type: s.type,
            });
          }
        }
      }
    }
    if (rawYaml['scripts'].sync && Array.isArray(rawYaml['scripts'].sync)) {
      for (const s of rawYaml['scripts'].sync) {
        if (typeof s === 'string') {
          scripts.sync.add(s, s);
        }
      }
    }
    if (rawYaml['scripts'].async && Array.isArray(rawYaml['scripts'].async)) {
      for (const s of rawYaml['scripts'].async) {
        if (typeof s === 'string') {
          scripts.async.add(s, s);
        }
      }
    }
  }

  if (rawYaml['elements']) {
    if (Array.isArray(rawYaml['elements'])) {
      for (const e of rawYaml['elements']) {
        if (typeof e === 'string') {
          elements.push(e);
        }
      }
    }
  }

  return {
    styles,
    scripts,
    elements,
    content,
    rawYaml,
  };
}

export interface HopinYaml {
  scripts: ScriptsAssetGroup;
  styles: StylesAssetGroup;
  elements: string[];
  content: string;
  rawYaml: {};
}