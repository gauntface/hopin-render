import * as fs from 'fs-extra';
import * as path from 'path';
import {test} from 'ava';

import { createBundle } from '../../src/node/create-bundle';
import { renderBundle } from '../../src/node/render-bundle';

const staticDir = path.join(__dirname, '..', 'static');

test('should render bundle', async (t) => {
  const rawInput = await fs.readFile(path.join(staticDir, 'bundle-example.tmpl'));
  const bundle = await createBundle(rawInput.toString(), staticDir);
  const result = await renderBundle(bundle);
  t.deepEqual(result, '');
});