const ContactFlowNode = require('./ContactFlowNode');

module.exports = class SetWorkingQueueNode extends ContactFlowNode {
  constructor() {
    super('SetQueue');
    this.setSuccessBranch(null);
    this.setErrorBranch(null);
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {SetWorkingQueueNode}
   */
  setSuccessBranch = node => this.setBranch('Success', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {SetWorkingQueueNode}
   */
  setErrorBranch = node => this.setBranch('Error', node);

  /**
   * @param {string} attributeName
   * @returns {SetWorkingQueueNode}
   */
  setQueueArnExternalAttribute = (attributeName) => {
    this.metadata.useDynamic = true;
    this.metadata.queue = attributeName;
    return this.setParameter('Queue', {
      namespace: 'External',
      value: attributeName,
      resourceName: null,
    });
  };
};
