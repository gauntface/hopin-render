const os = require('os');
const path = require('path');
const spawn = require('./spawn-promise');

function npmRun(scriptName) {
  let npmCmd = 'npm';
  if (os.platform() === 'win32') {
    npmCmd = 'npm.cmd';
  }
  return spawn(npmCmd, ['run', scriptName], {
    cwd: path.join(__dirname, '..', '..'),
    stdio: 'inherit',
  })
  .catch((err) => {
    console.error(err);
    throw err;
  });
};

module.exports = {
  npmRun,
};
