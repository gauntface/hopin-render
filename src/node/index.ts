import * as path from 'path';
import * as fs from 'fs-extra';

import {generateTemplate} from './template-generator';

export function createTemplate(rawInput: string, relativePath?: string) {
  return generateTemplate(rawInput, relativePath);
}

export async function createTemplateFromFile(filePath: string) {
  let fullPath = filePath;
  if (!path.isAbsolute(filePath)) {
    fullPath = path.resolve(filePath);
  }

  try {
    await fs.access(fullPath);
  } catch(err) {
    throw err;
  }

  const fileContents = await fs.readFile(fullPath);
  return generateTemplate(fileContents.toString(), path.dirname(fullPath));
}