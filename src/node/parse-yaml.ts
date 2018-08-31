import * as path from 'path';
import * as matter from 'gray-matter';

import { OrderedSet } from './models/ordered-set';
import {StylesAssetGroup} from './models/styles-assets-groups';
import {ScriptsAssetGroup} from './models/scripts-assets-groups';

export function parseYaml(rawYamlAndText: string, relativePath: string): TempBundle {
  // TODO: Add some error logging for bad inputs
  // TODO: Add a strict mode?

  const parseFrontMatter = matter(rawYamlAndText);
  // tslint:disable-next-line:no-any
  const rawYaml = parseFrontMatter.data as any;
  const content = parseFrontMatter.content.trim();

  const styles = new StylesAssetGroup();
  const scripts = new ScriptsAssetGroup();
  const partials: {[key: string]: string} = {};

  if (rawYaml['styles']) {
    if (rawYaml['styles'].inline && Array.isArray(rawYaml['styles'].inline)) {
      for (const s of rawYaml['styles'].inline) {
        if (typeof s === 'string') {
          const absPath = path.resolve(relativePath, s);
          styles.inline.add(absPath, absPath);
        }
      }
    }
    if (rawYaml['styles'].sync && Array.isArray(rawYaml['styles'].sync)) {
      for (const s of rawYaml['styles'].sync) {
        if (typeof s === 'string') {
          const absPath = path.resolve(relativePath, s);
          styles.sync.add(absPath, absPath);
        }
      }
    }
    if (rawYaml['styles'].async && Array.isArray(rawYaml['styles'].async)) {
      for (const s of rawYaml['styles'].async) {
        if (typeof s === 'string') {
          const absPath = path.resolve(relativePath, s);
          styles.async.add(absPath, absPath);
        }
      }
    }
  }

  if (rawYaml['scripts']) {
    if (rawYaml['scripts'].inline && Array.isArray(rawYaml['scripts'].inline)) {
      for (let s of rawYaml['scripts'].inline) {
        if (typeof s === 'string') {
          const absPath = path.resolve(relativePath, s);
          scripts.inline.add(absPath, {
            src: absPath,
            type: 'nomodule',
          });
        } else if (typeof s === 'object') {
          if (Object.keys(s).length === 1) {
            s = s[Object.keys(s)[0]];
          }
          if (s.src && s.type) {
            const absPath = path.resolve(relativePath, s.src);
            scripts.inline.add(absPath, {
              src: absPath,
              type: s.type,
            });
          }
        }
      }
    }
    if (rawYaml['scripts'].sync && Array.isArray(rawYaml['scripts'].sync)) {
      for (const s of rawYaml['scripts'].sync) {
        if (typeof s === 'string') {
          const absPath = path.resolve(relativePath, s);
          scripts.sync.add(absPath, absPath);
        }
      }
    }
    if (rawYaml['scripts'].async && Array.isArray(rawYaml['scripts'].async)) {
      for (const s of rawYaml['scripts'].async) {
        if (typeof s === 'string') {
          const absPath = path.resolve(relativePath, s);
          scripts.async.add(absPath, absPath);
        }
      }
    }
  }

  if (rawYaml['partials'] && Array.isArray(rawYaml['partials'])) {
    for (const p of rawYaml['partials']) {
      if (typeof p === 'string') {
        const absPath = path.resolve(relativePath, p);
        partials[p] = absPath;
      }
    }
  }

  return {
    styles,
    scripts,
    partials,
    content,
    rawYaml,
  };
}

interface TempBundle {
  scripts: ScriptsAssetGroup;
  styles: StylesAssetGroup;
  partials: {[key: string]: string};
  content: string;
  rawYaml: {};
}