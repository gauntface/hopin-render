import * as path from 'path';
import {EOL} from 'os';

import {logger} from '../utils/logger';

export async function getAbsPathsFromYaml(files: string[], relativePath: string, yamlProperty: string): Promise<string[]> {
  if (!Array.isArray(files)) {
    logger.warn(`The \'${yamlProperty}\' yaml field should be a list of ` +
    `strings but found '${typeof this.yaml.partials}' instead.`);
    return [];
  }

  // tslint:disable-next-line:no-any
  const problemPaths: any[] = [];
  const absPaths: string[] = [];
  for (const partialPath of this.yaml.partials) {
    if (typeof partialPath !== 'string') {
      problemPaths.push(partialPath);
      continue;
    }

    let absPath = partialPath;
    if (!path.isAbsolute(partialPath)) {
      absPath = path.join(relativePath, partialPath);
    }
    absPaths.push(absPath);
  }

  if (problemPaths.length > 0) {
    logger.warn(`Found partials that were not strings:
${problemPaths
.map((problemPath) => `- ${JSON.stringify(problemPath)}`)
.join(EOL)}`);
  }

  return absPaths;
}
