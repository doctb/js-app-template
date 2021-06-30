// imports
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');
const convertToUnixPath = require('slash');
const archiver = require('archiver');
const chalk = require('chalk');

// constants
const IS_WINDOWS = process.platform === 'win32';
const ENVS = ['dev', 'staging', 'prod'];

// helpers
const error = (msg) => { throw(msg); };
const loginfo = (msg) => { console.log('● ' + chalk.bgBlue.whiteBright(' ' + msg + ' ')); };
const execute = async (command, cb) => {
  return new Promise((resolve) => {
    exec(command, (err, stdout, stderr) => {
      if (cb) {
        cb(err, stdout, stderr);
      } else {
        console.log(`stdout: ${stdout}`);
        if (err) {
          return error(`error: ${err.message}`);
        }
        if (stderr) {
          return error(`stderr: ${stderr}`);
        }
      }
      resolve();
    });
  });
};
const rsync = async (src, target) => {
  src = path.resolve(__dirname, src);
  target = path.resolve(__dirname, target);
  if (target.substr(-1) !== '/') { target += '/'; }
  if (IS_WINDOWS) {
    const NON_ERROR_CODES = [0, 1, 2, 3, 5, 6, 7];
    if (src.substr(-1) === '/') { src = src.substr(0, src.length - 1); }
    await execute('robocopy "' + src + '" "' + target + '" /s /e /r:0 /z', (err, stdout, stderr) => {
      console.log(`stdout: ${stdout}`);
      if (err && NON_ERROR_CODES.indexOf(err.code) === -1) {
        return error(`error: ${err.message}`);
      }
      if (stderr) {
        return error(`stderr: ${stderr}`);
      }
    });
  } else {
    if (src.substr(-1) !== '/') { src += '/'; }
    await execute('rsync -av --progress "' + src + '" "' + target + '"');
  }
};

// globals
let webpackConfigPath = null;
let shouldCleanDist = false;
let shouldZip = false;
let shouldOptimizeAssets = false;
let packageVersion = null;
let packageName = null;
let envName = null;

(async () => {

  // retrieve parameters
  var args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '-wc':
      case '--webpack-config':
        i++;
        webpackConfigPath = path.resolve(__dirname, '../', args[i]);
      break;
      case '-e':
      case '--env-name':
        i++;
        envName = args[i];
      break;
      case '-c':
      case '--clean':
        shouldCleanDist = true;
      break;
      case '-z':
      case '--zip':
        shouldZip = true;
      break;
      case '-o':
      case '--optimize':
        shouldOptimizeAssets = true;
      break;
      default:
        error('unknown argument: ' + arg);
      break;
    }
  }

  // validate webpack config file
  let wpConfigExists = false;
  try {
    if (fs.existsSync(webpackConfigPath)) { wpConfigExists = true; }
  } catch(err) {}
  if (!wpConfigExists) {
    error('webpack config file not found: ' + webpackConfigPath);
  }

  // retrieve package version and name
  const package = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'));
  packageVersion = package.version;
  packageName = package.name;

  // cleanup dist folder
  if (shouldCleanDist) {
    loginfo('Cleaning dist folder');
    fs.rmdirSync(path.resolve(__dirname, '../dist'), { recursive: true });
  }

  // webpack build
  loginfo('Webpack building');
  if (IS_WINDOWS) {
    await execute('cmd /c for %A in ("' + webpackConfigPath + '") do @echo %~sA', (err, stdout, stderr) => {
      if (err) { return error(`error: ${err.message}`); }
      if (stderr) { return error(`stderr: ${stderr}`); }
      webpackConfigPath = stdout;
    })
  }
  await execute('npx webpack --config "' + webpackConfigPath + '"');

  // copy "hard files" (files that need to be copied as is in the build,
  // such as index.html, favicon.ico, fbapp-config.json...
  loginfo('Copying hard files');
  await rsync('../src/clientHardFiles/', '../dist/client/');

  // copy assets folder
  loginfo('Copying assets');
  await rsync('../src/assets/', '../dist/client/assets/');

  // png quantization for staging and prod
  if (shouldOptimizeAssets) {
    await (async () => {
      let srcFolder = path.resolve(__dirname, '../dist/client/assets/');
      if (srcFolder.substr(-1) !== '/') { srcFolder += '/'; }
      let targetFolder = srcFolder.substr(0, srcFolder.length - 1);
      if (IS_WINDOWS) {
        srcFolder = convertToUnixPath(srcFolder);
      }
      const files = await imagemin([srcFolder + '*.{jpg,png}'], {
        destination: targetFolder,
        plugins: [
          imageminJpegtran(),
          imageminPngquant({
            quality: [0.6, 0.8]
          })
        ]
      });

      console.log(files);
    })();
  }

  // zip compression
  if (shouldZip) {
    loginfo('Zipping');
    await (async () => {
      return new Promise((resolve) => {
        const zipFilename = packageName + '-' + packageVersion + '-client' + (envName ? '-' + envName : '') + '.zip';
        var output = fs.createWriteStream(path.resolve(__dirname, '../dist/' + zipFilename));
        var archive = archiver('zip');
        output.on('close', function () {
          console.log(archive.pointer() + ' total bytes');
          console.log('archiver has been finalized and the output file descriptor has closed.');
          resolve();
        });
        archive.on('error', function(err){
          error(err);
        });
        archive.pipe(output);
        archive.directory(path.resolve(__dirname, '../dist/client/'), false);
        archive.finalize();
      });
    })();
  }

  loginfo('DONE');
})();
