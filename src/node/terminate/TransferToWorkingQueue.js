const AbstractNode = require('../AbstractNode');

/**
 * @typedef TransferToWorkingQueueOptions
 * @property {AbstractNode} [atCapacityBranch]
 * @property {AbstractNode} [errorBranch]
 */

module.exports = class TransferToWorkingQueue extends AbstractNode {
  /**
   * @param {TransferToWorkingQueueOptions} [options]
   */
  constructor(options = {}) {
    super('Transfer');
    this.metadata.useDynamic = false;
    this.target = 'Queue';
    this.setAtCapacityBranch(options.atCapacityBranch || null);
    this.setErrorBranch(options.errorBranch || null);
  }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setAtCapacityBranch(node) { return this.setBranch('AtCapacity', node); }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setErrorBranch(node) { return this.setBranch('Error', node); }
};
