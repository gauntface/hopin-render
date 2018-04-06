import * as handlebars from 'handlebars';
import * as matter from 'gray-matter';
import * as fs from 'fs-extra';
import * as path from 'path';

export class Template {
  private relativePath: string| null;
  private template: string;
  private yaml: object;

  constructor(template: string, relativePath?: string) {
    const parseFrontMatter = matter(template);

    this.relativePath = relativePath || null;
    this.template = parseFrontMatter.content;
    this.yaml = parseFrontMatter.data;
  }

  render(data?: object) {
    const handlebarsTemplate = handlebars.compile(this.template);
    handlebars.registerHelper('hopinPartial', (filePath: string) => {
      if (!this.relativePath) {
        throw new Error('hopinPartial can only be used with compileFile()');
      }

      if (!path.isAbsolute(filePath)) {
        filePath = path.join(this.relativePath, filePath);
      }

      return fs.readFileSync(filePath).toString();
    });
    return handlebarsTemplate({
      data,
      yaml: this.yaml,
    });
  }
}

export async function generateTemplate(template: string, relativePath?: string): Promise<Template> {
  return new Template(template, relativePath);
}
