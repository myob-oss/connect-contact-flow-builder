const ContactFlowNode = require('./ContactFlowNode');

module.exports = class InvokeExternalResourceNode extends ContactFlowNode {
  constructor(functionArn, timeoutSeconds = 3) {
    super('InvokeExternalResource');
    this.setSuccessBranch(null);
    this.setErrorBranch(null);
    this.setParameter('FunctionArn', { value: functionArn });
    this.setParameter('TimeLimit', { value: timeoutSeconds.toString() });
    this.target = 'Lambda';
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {InvokeExternalResourceNode}
   */
  setSuccessBranch = node => this.setBranch('Success', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {InvokeExternalResourceNode}
   */
  setErrorBranch = node => this.setBranch('Error', node);
};
