const ContactFlowNode = require('../AbstractNode');

/**
 * @typedef InvokeExternalResourceOptions
 * @property {string} functionArn
 * @property {number} [timeLimit] - The execution time limit in seconds; defaults to {3}.
 * @property {ContactFlowNode} [successBranch]
 */

module.exports = class InvokeExternalResource extends ContactFlowNode {
  /**
   * @param {InvokeExternalResourceOptions} [options]
   */
  constructor(options = {}) {
    super('InvokeExternalResource');
    this.setSuccessBranch(null);
    this.setErrorBranch(null);
    this.setParameter('FunctionArn', { value: options.functionArn });
    this.setParameter('TimeLimit', { value: (options.timeLimit || 3).toString() });
    this.target = 'Lambda';
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {InvokeExternalResource}
   */
  setSuccessBranch = node => this.setBranch('Success', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {InvokeExternalResource}
   */
  setErrorBranch = node => this.setBranch('Error', node);
};
