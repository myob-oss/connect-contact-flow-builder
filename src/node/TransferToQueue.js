const ContactFlowNode = require('./ContactFlowNode');

/**
 * @typedef TransferToQueueOptions
 * @property {ContactFlowNode} atCapacityBranch
 * @property {ContactFlowNode} errorBranch
 */

module.exports = class TransferToQueue extends ContactFlowNode {
  /**
   *
   * @param {TransferToQueueOptions} [options]
   */
  constructor(options = {}) {
    super('Transfer');
    this.target = 'Queue';
    this.queue = null;
    this.useDynamic = false;
    this.setAtCapacityBranch(options.atCapacityBranch || null);
    this.setErrorBranch(options.errorBranch || null);
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {TransferToQueue}
   */
  setAtCapacityBranch = node => this.setBranch('AtCapacity', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {TransferToQueue}
   */
  setErrorBranch = node => this.setBranch('Error', node);
};
