const { isDynamicValue } = require('../dynamicValue');
const ContactFlowNode = require('../AbstractNode');

/**
 * @typedef InvokeAWSLambdaFunctionInputParameter
 * @property {string} destinationKey
 * @property {string|DynamicValue} value
 */

/**
 * @typedef InvokeAWSLambdaFunctionOptions
 * @property {string} functionArn
 * @property {AbstractNode} [successBranch]
 * @property {AbstractNode} [errorBranch]
 * @property {number} [timeLimit] - The execution time limit in seconds; defaults to {3}.
 * @property {InvokeAWSLambdaFunctionInputParameter[]} [inputParameters] -
 */

module.exports = class InvokeAWSLambdaFunction extends ContactFlowNode {
  /**
   * @param {InvokeAWSLambdaFunctionOptions} [options]
   */
  constructor(options = {}) {
    super('InvokeExternalResource');
    this.target = 'Lambda';
    this.metadata.dynamicMetadata = {};
    this.setFunctionArn(options.functionArn);
    this.setSuccessBranch(options.successBranch || null);
    this.setErrorBranch(options.errorBranch || null);
    this.setTimeLimit(options.timeLimit || 3);
    if (Array.isArray(options.inputParameters)) {
      options.inputParameters.forEach((parameter) => {
        if (isDynamicValue(parameter.value)) {
          this.addDynamicInputParameter(parameter.destinationKey, parameter.value);
        } else {
          this.addTextInputParameter(parameter.destinationKey, parameter.value);
        }
      });
    }
  }

  /**
   * @param {string|DynamicValue} value
   */
  setFunctionArn(value) {
    this.metadata.useDynamic = isDynamicValue(value);
    this.setParameter('FunctionArn', value);
  }

  /**
   * @param {number} value
   */
  setTimeLimit(value) {
    this.setParameter('TimeLimit', value.toString());
  }

  /**
   * @param {AbstractNode} node
   * @returns {InvokeAWSLambdaFunction}
   */
  setSuccessBranch(node) {
    return this.setBranch('Success', node);
  }

  /**
   * @param {AbstractNode} node
   * @returns {InvokeAWSLambdaFunction}
   */
  setErrorBranch(node) {
    return this.setBranch('Error', node);
  }

  /**
   * @param {string} destinationKey
   * @param {string} value
   * @returns {InvokeAWSLambdaFunction}
   */
  addTextInputParameter(destinationKey, value) {
    this.metadata.dynamicMetadata[destinationKey] = false;
    return this.addParameter('Parameter', { key: destinationKey, value });
  }

  /**
   * @param {string} destinationKey
   * @param {DynamicValue} value
   * @returns {InvokeAWSLambdaFunction}
   */
  addDynamicInputParameter(destinationKey, value) {
    this.metadata.dynamicMetadata[destinationKey] = true;
    return this.addParameter('Parameter', { key: destinationKey, ...value });
  }
};
