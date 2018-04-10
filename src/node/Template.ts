import * as handlebars from 'handlebars';
import * as matter from 'gray-matter';
import * as fs from 'fs-extra';
import * as path from 'path';

import { compileFile } from '.';
import {logger} from "./utils/logger";

interface YamlData {
  partials: string[];
  data: object;
}

export class Template {
  private relativePath: string;
  private template: string;
  private partials: {
    [partialName: string]: Template;
  };
  private yaml: YamlData | null;

  constructor(template: string, relativePath?: string) {
    const parseFrontMatter = matter(template);

    this.relativePath = relativePath || process.cwd();
    this.template = parseFrontMatter.content;
    this.yaml = parseFrontMatter.data as YamlData | null;
    this.partials = {};
  }

  private async compile() {
    await this.loadPartials();
  }

  private async loadPartials() {
    if (!this.yaml.partials) {
      return;
    }

    if (!Array.isArray(this.yaml.partials)) {
      logger.warn('The \'partials\' yaml field should be a list of strings ' +
      `but found '${typeof this.yaml.partials}' instead.`);
      return;
    }

    // tslint:disable-next-line:no-any
    const problemPartials: any[] = [];
    for (const partialPath of this.yaml.partials) {
      if (typeof partialPath !== 'string') {
        problemPartials.push(partialPath);
        continue;
      }

      let absPath = partialPath;
      if (!path.isAbsolute(partialPath)) {
        absPath = path.join(this.relativePath, partialPath);
      }

      const template = await compileFile(absPath);
      this.partials[partialPath] = template;
    }

    if (problemPartials.length > 0) {
      logger.warn(`Found partials that were not strings:
${problemPartials
  .map((partial) => `- ${JSON.stringify(partial)}`)
  .join('\n')}`);
    }
  }

  async render(data?: object) {
    const handlebarsInstance = handlebars.create();

    await this.compile();

    for (const partialName of Object.keys(this.partials)) {
      const template = this.partials[partialName];
      const renderedPartial = await template.render(data);
      handlebarsInstance.registerPartial(partialName, renderedPartial);
    }

    const handlebarsTemplate = handlebarsInstance.compile(this.template);
    return handlebarsTemplate({
      data,
      yaml: this.yaml,
    });
  }
}

export async function generateTemplate(template: string, relativePath?: string): Promise<Template> {
  return new Template(template, relativePath);
}
