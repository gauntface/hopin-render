
const renderSubView = ({
  relativePath,
  publicPath,
  viewPath,
  data = {},
}: {
  relativePath: string,
  publicPath: string,
  viewPath: string,
  data?: Object,
}) => {
  console.log(relativePath);
  console.log(publicPath);
  console.log(viewPath);
  console.log(data);
  /** const subTemplate = generateSubTemplate({
    publicPath,
    viewPath,
  });**/
};

const renderShellView = ({

}) => {

};

export {renderSubView};
export {renderShellView};
