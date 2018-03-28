import * as fs  from 'fs-extra';
import * as parseYaml from 'gray-matter';
import * as path from 'path';

const parseViewFile = async (viewPath: string): Promise<{ yaml: object; contents: string; }> => {
  const viewFileBuffer = await fs.readFile(viewPath);
  const viewContents = viewFileBuffer.toString();
  const parsedYaml = parseYaml(viewContents);

  return {
    yaml: parsedYaml.data,
    contents: parsedYaml.content.trim(),
  };
};

export {parseViewFile};
