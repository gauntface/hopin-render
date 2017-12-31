import { AssetsGroup } from "./AssetsGroup";

class FlatBundle {
  public mustacheString: string;
  public partialMustacheStrings: object;
  public contentStrings: Array<string>;
  public data: object;
  public styles: {
    raw: Array<string>,
    inline: Array<string>,
    sync: Array<string>,
    async: Array<string>,
  };
  public scripts: {
    raw: Array<string>,
    inline: Array<string>,
    sync: Array<string>,
    async: Array<string>,
  };

  constructor({mustacheString, styles, scripts, partialMustacheStrings, contentStrings, data}: {mustacheString: string, styles: AssetsGroup, scripts: AssetsGroup, partialMustacheStrings: object, contentStrings: Array<string>, data: object}) {
    this.mustacheString = mustacheString,
    this.partialMustacheStrings = partialMustacheStrings;
    this.contentStrings = contentStrings;
    this.data = data;

    this.styles = {
      raw: [],
      inline: [],
      sync: [],
      async: []
    };

    this.scripts = {
      raw: [],
      inline: [],
      sync: [],
      async: []
    };
    styles.raw.forEach((value) => this.styles.raw.push(value));
    styles.inline.forEach((value) => this.styles.inline.push(value));
    styles.sync.forEach((value) => this.styles.sync.push(value));
    styles.async.forEach((value) => this.styles.async.push(value));

    scripts.raw.forEach((value) => this.scripts.raw.push(value));
    scripts.inline.forEach((value) => this.scripts.inline.push(value));
    scripts.sync.forEach((value) => this.scripts.sync.push(value));
    scripts.async.forEach((value) => this.scripts.async.push(value));
  }
}

export {FlatBundle};
