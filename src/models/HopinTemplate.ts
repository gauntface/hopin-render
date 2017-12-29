import { AssetsGroup } from "./AssetsGroup";

abstract class HopinTemplate {
  mustacheString: string;
  partials: Array<HopinTemplate>;
  scripts: AssetsGroup;
  styles: AssetsGroup;

  constructor({
    mustacheString,
    partials = [],
    styles,
    scripts,
  }: {
    mustacheString: string,
    partials?: Array<HopinTemplate>,
    styles: AssetsGroup,
    scripts: AssetsGroup,
  }) {
    this.mustacheString = mustacheString;
    this.partials = partials;
    this.styles = styles;
    this.scripts = scripts;
  }
}

export default HopinTemplate;
