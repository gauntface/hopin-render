import { SubTemplate } from "../models/SubTemplate";
import { AssetsGroup } from "../models/AssetsGroup";

const generateSubTemplate = ({
  relativePath,
  publicPath,
  viewPath,
}: {
  relativePath: String,
  publicPath: String,
  viewPath: String,
}): SubTemplate => {
  return new SubTemplate({
    mustacheString: '',
    styles: new AssetsGroup(),
    scripts: new AssetsGroup(),
  });
};

export {generateSubTemplate};
