import { AssetsGroup } from "./AssetsGroup";

class TemplateBundle {
  public id: string | null;
  public mustacheString: string;
  public contentBundles: Array<TemplateBundle>;
  public partialBundles: Array<TemplateBundle>;
  public scripts: AssetsGroup;
  public styles: AssetsGroup;
  public data: object;

  constructor({
    id,
    mustacheString,
    partialBundles = [],
    contentBundles = [],
    styles,
    scripts,
    data,
  }: {
    id: string | null,
    mustacheString: string,
    partialBundles?: Array<TemplateBundle>,
    contentBundles?: Array<TemplateBundle>,
    styles: AssetsGroup,
    scripts: AssetsGroup,
    data: object,
  }) {
    this.id = id;
    this.mustacheString = mustacheString;
    this.contentBundles = contentBundles;
    this.partialBundles = partialBundles;
    this.styles = styles;
    this.scripts = scripts;
    this.data = data;
  }
}

export {TemplateBundle};
