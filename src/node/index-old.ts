/* import * as path from 'path';
import * as fs from 'fs-extra';

import {logger} from "./utils/logger";
import { generateTemplate, generateMarkdownTemplate, Template } from "./Template";

export function compile(template: string, relativePath?: string): Promise<Template> {
  return generateTemplate(template, relativePath);
}

export async function compileFile(filePath: string): Promise<Template> {
  let fullPath = filePath;
  if (!path.isAbsolute(filePath)) {
    fullPath = path.resolve(filePath);
  }

  try {
    await fs.access(fullPath);
  } catch(err) {
    logger.error(`Unable to access '${filePath}'`);
    throw err;
  }

  const fileContents = await fs.readFile(fullPath);
  return generateTemplate(fileContents.toString(), path.dirname(fullPath));
}

export function compileMarkdown(template: string, relativePath?: string): Promise<Template> {
  return generateMarkdownTemplate(template, relativePath);
}

export async function compileMarkdownFile(filePath: string): Promise<Template> {
  let fullPath = filePath;
  if (!path.isAbsolute(filePath)) {
    fullPath = path.resolve(filePath);
  }

  try {
    await fs.access(fullPath);
  } catch(err) {
    logger.error(`Unable to access '${filePath}'`);
    throw err;
  }

  const fileContents = await fs.readFile(fullPath);
  return generateMarkdownTemplate(fileContents.toString(), path.dirname(fullPath));
}*/