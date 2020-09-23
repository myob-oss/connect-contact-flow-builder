/**
 * @typedef BuildContactFlowCliArgs
 * @property {boolean} help
 * @property {boolean} isValid
 * @property {string} sourcePath
 * @property {string} flowName
 * @property {string[]} unknownArgs
 * @property {string[]} generateArgs
 */

/**
 * @param {string[]} processArgs
 * @returns {BuildContactFlowCliArgs}
 */
function parseArgs(processArgs) {
  const args = processArgs.slice(2);
  const result = {
    help: false,
    isValid: false,
    unknownArgs: [],
    generateArgs: [],
    flowName: '',
    sourcePath: '',
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg[0] === '-') {
      if (arg === '-h' || arg === '--help') {
        result.help = true;
      } else {
        result.unknownArgs.push(arg);
      }
    } else if (!result.flowName) {
      result.flowName = arg;
    } else if (!result.sourcePath) {
      result.sourcePath = arg;
    } else {
      result.generateArgs.push(arg);
    }
  }

  result.isValid = !!args.flowName && !!args.sourcePath;

  return result;
}

/**
 *
 * @param {string} sourceFullPath
 * @param {string[]} parameters
 * @returns {ContactFlowNode|ErrorResult}
 */
function loadContactFlowDefinition(sourceFullPath, parameters) {
  let sourceFunction;
  try {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    sourceFunction = require(sourceFullPath);
  } catch (error) {
    return {
      error: {
        innerError: error,
        message: `Failed to import the module file "${sourceFullPath}"`,
      },
    };
  }

  if (typeof sourceFunction !== 'function') {
    return {
      error: {
        message: `The default export of "${sourceFullPath}" is not a function.`,
      },
    };
  }

  const result = sourceFunction(...parameters);
  if (typeof result !== 'object') {
    return {
      error: {
        message: `The default export of "${sourceFullPath}" did not return an object.
It returned a value of type "${typeof result}".`,
      },
    };
  }

  return result;
}

module.exports = {
  parseArgs,
  loadContactFlowDefinition,
};
