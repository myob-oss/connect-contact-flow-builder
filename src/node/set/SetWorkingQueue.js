const AbstractSetWorkingQueue = require('../AbstractSetWorkingQueue');

/**
 * @typedef SetWorkingQueueOptions
 * @property {string} [queueArn]
 * @property {string} [agentArn]
 * @property {string} [displayName]
 * @property {AbstractNode} [successBranch]
 * @property {AbstractNode} [errorBranch]
 */

module.exports = class SetWorkingQueue extends AbstractSetWorkingQueue {
  /**
   * @param {SetWorkingQueueOptions} [options]
   */
  constructor(options = {}) {
    super('SetQueue');
    this.metadata.useDynamic = false;
    this.setSuccessBranch(options.successBranch || null);
    this.setErrorBranch(options.errorBranch || null);
    if (options.queueArn) {
      this.setQueue(options.queueArn, options.displayName);
    } else if (options.agentArn) {
      this.setAgent(options.agentArn, options.displayName);
    }
  }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setSuccessBranch(node) {
    return this.setBranch('Success', node);
  }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setErrorBranch(node) {
    return this.setBranch('Error', node);
  }
};
