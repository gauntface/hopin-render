import * as handlebars from 'handlebars';
import * as matter from 'gray-matter';

export class Template {
  private template: string;
  private yaml: object;

  constructor(template: string) {
    const parseFrontMatter = matter(template);

    this.template = parseFrontMatter.content;
    this.yaml = parseFrontMatter.data;
  }

  render(data?: object) {
    const handlebarsTemplate = handlebars.compile(this.template);
    return handlebarsTemplate({
      data,
      yaml: this.yaml,
    });
  }
}

export async function generateTemplate(template: string): Promise<Template> {
  return new Template(template);
}
