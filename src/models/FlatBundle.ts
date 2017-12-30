import { AssetsGroup } from "./AssetsGroup";

class FlatBundle {
  public mustacheString: string;
  public styles: AssetsGroup;
  public scripts: AssetsGroup;
  public partialMustacheStrings: object;

  constructor({mustacheString, styles, scripts, partialMustacheStrings}: {mustacheString: string, styles: AssetsGroup, scripts: AssetsGroup, partialMustacheStrings: object}) {
    this.mustacheString = mustacheString,
    this.styles = styles;
    this.scripts = scripts;
    this.partialMustacheStrings = partialMustacheStrings;
  }
}

export {FlatBundle};
