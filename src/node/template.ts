import * as handlebars from 'handlebars';
import {Partial} from './create-bundle';
import { OrderedSet } from './models/ordered-set';

export class Template {
  content: string;
  partials: OrderedSet<Partial>;
  yaml: {};

  constructor(content: string, partials: OrderedSet<Partial>, yaml: {}) {
    this.content = content;
    this.partials = partials;
    this.yaml = yaml;
  }

  async render(data: {} = {}, opts: RenderOpts = {}): Promise<string> {
    const handlebarsInstance = await this.getHandlebars(data);

    if (opts.helpers) {
      // Register additional template helpers
      for (const helperName of Object.keys(opts.helpers)) {
        handlebarsInstance.registerHelper(helperName, opts.helpers[helperName]);
      }
    }

    const handlebarsTemplate = handlebarsInstance.compile(this.content);
    return handlebarsTemplate({
      yaml: this.yaml,
      data,
    });
  }

  async getHandlebars(data?: {}): Promise<typeof handlebars> {
    const handlebarsInstance = handlebars.create();
  
    // Register partials
    for (const partial of this.partials.values()) {
      const renderedPartial = await partial.template.render(data);
      handlebarsInstance.registerPartial(partial.id, renderedPartial);
    }

    return handlebarsInstance;
  }
}

type RenderOpts = {
  // tslint:disable-next-line:no-any
  helpers?: {[key: string]: () => any}
};