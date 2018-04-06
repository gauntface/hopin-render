import * as path from 'path';
import * as fs from 'fs-extra';

import {logger} from "./utils/logger";
import { generateTemplate, Template } from "./Template";

export function compile(template: string): Promise<Template> {
  return generateTemplate(template);
}

export async function compileFile(filePath: string): Promise<Template> {
  let fullPath = filePath;
  if (!path.isAbsolute(filePath)) {
    fullPath = path.resolve(filePath);
  }

  try {
    await fs.access(fullPath);
  } catch(err) {
    logger.error(`Unable to access ${filePath}`);
    throw err;
  }

  const fileContents = await fs.readFile(fullPath);
  return generateTemplate(fileContents.toString(), path.dirname(fullPath));
}
