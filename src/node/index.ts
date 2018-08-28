import {generateTemplate} from './template-generator';

export function createTemplate(rawInput: string, relativePath?: string) {
  return generateTemplate(rawInput, relativePath);
}