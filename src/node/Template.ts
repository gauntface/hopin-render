export class Template {
  render() {
    return '';
  }
}

export async function generateTemplate(template: string): Promise<Template> {
  console.log(template);
  return new Template();
}