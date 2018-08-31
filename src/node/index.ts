import {generateTemplate, generateTemplateFromFile} from './template-generator';

export function createTemplate(rawInput: string, relativePath?: string) {
  return generateTemplate(rawInput, relativePath);
}

export async function createTemplateFromFile(filePath: string) {
  return generateTemplateFromFile(filePath);
}