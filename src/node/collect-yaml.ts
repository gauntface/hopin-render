import {Template} from './template';
import { YAMLData } from './template-generator';

export async function collectYaml(t: Template): Promise<YAMLData> {
  const allYaml = new YAMLData();

  // 1. For current template, get child templates (a.k.a partials)
  const children = t.yaml.partials.values();

  // 2. Call collectYaml() for each child
  for (const p of children) {
    const pYaml = await collectYaml(p.template);

    // 3. Merge results into original templates yaml
    allYaml.merge(pYaml);
  }

  // 4. Return merged results
  return allYaml;
}