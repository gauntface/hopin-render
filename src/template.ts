import * as handlebars from 'handlebars';
import {Partial} from './create-bundle';
import { OrderedSet } from './models/ordered-set';
import { RenderOpts } from '.';

export class Template {
  content: string;
  partials: OrderedSet<Partial>;
  yaml: {};

  constructor(content: string, partials: OrderedSet<Partial>, yaml: {}) {
    this.content = content;
    this.partials = partials;
    this.yaml = yaml;
  }

  async render(opts: RenderOpts = {}, internalOpts: InternalRenderOpts = {}): Promise<string> {
    const handlebarsInstance = await this.getHandlebars(opts);

    if (internalOpts.helpers) {
      // Register additional template helpers
      for (const helperName of Object.keys(internalOpts.helpers)) {
        handlebarsInstance.registerHelper(helperName, internalOpts.helpers[helperName]);
      }
    }

    const handlebarsTemplate = handlebarsInstance.compile(this.content);

    let topLevel = {};
    if (opts.topLevel) {
      topLevel = opts.topLevel;
    }
    const mergedTemplateData = Object.assign(topLevel, {yaml: this.yaml, data: opts.data});
    return handlebarsTemplate(mergedTemplateData);
  }

  async getHandlebars(opts: RenderOpts): Promise<typeof handlebars> {
    const handlebarsInstance = handlebars.create();
  
    // Register partials
    for (const partial of this.partials.values()) {
      const renderedPartial = await partial.template.render(opts);
      handlebarsInstance.registerPartial(partial.id, renderedPartial);
    }

    return handlebarsInstance;
  }
}

type InternalRenderOpts = {
  // tslint:disable-next-line:no-any
  helpers?: {[key: string]: () => any}
};