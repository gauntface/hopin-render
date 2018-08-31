import {OrderedSet} from './ordered-set';

export class ScriptsAssetGroup {
  inline: OrderedSet<InlineScript>;
  sync: OrderedSet<string>;
  async: OrderedSet<string>;

  constructor() {
    this.inline = new OrderedSet<InlineScript>();
    this.sync = new OrderedSet<string>();
    this.async = new OrderedSet<string>();
  }

  add(scripts: ScriptsAssetGroup) {
    this.inline.addSet(scripts.inline);
    this.sync.addSet(scripts.sync);
    this.async.addSet(scripts.async);
  }
}

interface InlineScript {
  src: string;
  type: 'nomodule'|'module';
}