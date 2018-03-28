import * as path from 'path';

import {logger} from "./utils/logger";
import { Template } from "./Template";

export function compile(template: string): Template {
  return new Template();
}

export function compileFile(filePath: string) {
  if (!path.isAbsolute(filePath)) {
    const fullPath = path.resolve(filePath);
    logger.warn(`Resolving full path of template file: ${fullPath}`);
  }
  return new Template();
}
