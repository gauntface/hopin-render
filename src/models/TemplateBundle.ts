import { AssetsGroup } from "./AssetsGroup";

class TemplateBundle {
  public id: string | null;
  public mustacheString: string;
  public partialBundles: Array<TemplateBundle>;
  public scripts: AssetsGroup;
  public styles: AssetsGroup;

  constructor({
    id,
    mustacheString,
    partialBundles = [],
    styles,
    scripts,
  }: {
    id: string | null,
    mustacheString: string,
    partialBundles?: Array<TemplateBundle>,
    styles: AssetsGroup,
    scripts: AssetsGroup,
  }) {
    this.id = id;
    this.mustacheString = mustacheString;
    this.partialBundles = partialBundles;
    this.styles = styles;
    this.scripts = scripts;
  }
}

export {TemplateBundle};
