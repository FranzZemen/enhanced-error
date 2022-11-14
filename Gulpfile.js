import * as gulpBase from '@franzzemen/gulp-base';
import {npmu as npmuFunc} from '@franzzemen/npmu';
import {createRequire} from 'node:module';
import {dirname, join} from 'node:path';
import {cwd} from 'node:process';
import {fileURLToPath} from 'node:url';

const requireModule = createRequire(import.meta.url);
gulpBase.init(requireModule('./package.json'), cwd());
gulpBase.setCleanTranspiled(true);


export const npmu = (cb) => {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  
  npmuFunc([
    {
      path: join(__dirname, '../gulp-base'), packageName: '@franzzemen/gulp-base'
    }, {
      path: join(__dirname, '../npmu'), packageName: '@franzzemen/npmu'
    }, {
      path: join(__dirname, '../execution-context'), packageName: '@franzzemen/execution-context'
    }, {
      path: join(__dirname, '../app-execution-context'), packageName: '@franzzemen/app-execution-context'
    }, {
      path: join(__dirname, '../logger-adapter'), packageName: '@franzzemen/logger-adapter'
    }, {
      path: join(__dirname, './'), packageName: '@franzzemen/enhanced-error'
    }])
    .then(() => {
      console.log('cb...');
      cb();
    });
};

export const test = gulpBase.test;

export const clean = gulpBase.clean;
export const buildTest = gulpBase.buildTest;
export default gulpBase.default;

export const patch = gulpBase.patch;
export const minor = gulpBase.minor;
export const major = gulpBase.major;
