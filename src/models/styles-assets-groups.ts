import {OrderedSet} from './ordered-set';

export class StylesAssetGroup {
  inline: OrderedSet<string>;
  sync: OrderedSet<string>;
  async: OrderedSet<string>;

  constructor() {
    this.inline = new OrderedSet<string>();
    this.sync = new OrderedSet<string>();
    this.async = new OrderedSet<string>();
  }

  append(styles: StylesAssetGroup) {
    this.inline.addSet(styles.inline);
    this.sync.addSet(styles.sync);
    this.async.addSet(styles.async);
  }
}