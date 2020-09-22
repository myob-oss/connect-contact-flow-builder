const ContactFlowNode = require('../AbstractNode');

/**
 * @typedef SetWorkingQueueOptions
 * @property {ContactFlowNode} [successBranch]
 * @property {ContactFlowNode} [errorBranch]
 * @property {string} [queueArnExternalAttribute]
 */

module.exports = class SetWorkingQueue extends ContactFlowNode {
  /**
   * @param {SetWorkingQueueOptions} options
   */
  constructor(options) {
    super('SetQueue');
    this.setSuccessBranch(options.successBranch || null);
    this.setErrorBranch(options.errorBranch || null);
    if (options.queueArnExternalAttribute) {
      this.setQueueArnExternalAttribute(options.queueArnExternalAttribute);
    }
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {SetWorkingQueue}
   */
  setSuccessBranch = node => this.setBranch('Success', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {SetWorkingQueue}
   */
  setErrorBranch = node => this.setBranch('Error', node);

  /**
   * @param {string} attributeName
   * @returns {SetWorkingQueue}
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
