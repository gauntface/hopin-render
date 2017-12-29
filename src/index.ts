import { generateSubTemplate } from "./factory/generateSubTemplate";

const renderSubView = ({
  relativePath,
  publicPath,
  viewPath,
  data = {},
}: {
  relativePath: String,
  publicPath: String,
  viewPath: String,
  data?: Object,
}) => {
  console.log(relativePath);
  console.log(publicPath);
  console.log(viewPath);
  console.log(data);
  const subTemplate = generateSubTemplate({
    relativePath,
    publicPath,
    viewPath,
  });
};

const renderShellView = ({

}) => {

};

export {renderSubView};
export {renderShellView};
