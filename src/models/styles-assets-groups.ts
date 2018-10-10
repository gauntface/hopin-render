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

  prepend(styles: StylesAssetGroup) {
    const newInline = new OrderedSet<string>();
    newInline.addSet(styles.inline);
    newInline.addSet(this.inline);
    this.inline = newInline;

    const newSync = new OrderedSet<string>();
    newSync.addSet(styles.sync);
    newSync.addSet(this.sync);
    this.sync = newSync;

    const newAsync = new OrderedSet<string>();
    newAsync.addSet(styles.async);
    newAsync.addSet(this.async);
    this.async = newAsync;
  }
}