#!/usr/bin/env node

const path = require('path');
const buildContactFlow = require('./');

/**
 * @typedef BuildContactFlowCliArgs
 * @property {boolean} help
 * @property {string} sourcePath
 * @property {string[]} unknownArgs
 * @property {string[]} generateArgs
 */

/**
 * @param {string[]} processArgs
 * @returns {BuildContactFlowCliArgs}
 */
function parseArgs(processArgs) {
  const args = processArgs.slice(2);
  let result = { help: false, unknownArgs: [], generateArgs: [], sourcePath: '' };
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (arg[0] === '-') {
      if (arg === '-h' || arg === '--help') {
        result.help = true;
      } else {
        result.unknownArgs.push(arg);
      }
    } else if (!result.sourcePath) {
      result.sourcePath = arg;
    } else {
      result.generateArgs.push(arg);
    }
  }
  return result;
}

const args = parseArgs(process.argv);
if (args.help || !args.sourcePath) {
  process.stderr.write(`Usage: buildContactFlow [...options] sourcePath [...builderArgs]

Import JavaScript module from sourcePath, pass builderArgs as positional
arguments to the exported function and print the returned object to stdout.

Example:
  buildContactFlow ./flowDefinition.js $LAMBDA_ARN
    
Options:
  -h, --help          Print command line usage info 
`);
  process.exit(0);
}

const sourceFullPath = path.resolve(process.cwd(), args.sourcePath);
let sourceFunction;
try {
  sourceFunction = require(sourceFullPath);
} catch (error) {
  process.stderr.write(`Failed to import the module file "${args.sourcePath}".

${error.message}
`);
  process.exit(1);
}

if (typeof sourceFunction !== 'function') {
  process.stderr.write(`The default export of "${args.sourcePath}" is not a function.
`);
  process.exit(1);
}

const result = sourceFunction(...args.generateArgs);
if (typeof result !== 'object') {
  process.stderr.write(`The default export of "${args.sourcePath}" did not return an object.
It returned a value of type "${typeof result}".
`);
  process.exit(1);
}

process.stdout.write(JSON.stringify(buildContactFlow(result)) + '\n');