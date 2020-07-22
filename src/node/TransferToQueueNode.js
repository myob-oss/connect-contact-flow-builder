const ContactFlowNode = require('./ContactFlowNode');

module.exports = class TransferToQueueNode extends ContactFlowNode {
  constructor() {
    super('Transfer');
    this.target = 'Queue';
    this.queue = null;
    this.useDynamic = false;
    this.setAtCapacityBranch(null);
    this.setErrorBranch(null);
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {TransferToQueueNode}
   */
  setAtCapacityBranch = node => this.setBranch('AtCapacity', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {TransferToQueueNode}
   */
  setErrorBranch = node => this.setBranch('Error', node);
};
