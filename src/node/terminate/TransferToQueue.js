const AbstractNode = require('../AbstractNode');
// const { isDynamicValue } = require('../dynamicValue');

/**
 * @typedef TransferToQueueOptions
 */

module.exports = class TransferToQueue extends AbstractNode {
  /**
   * @param {TransferToQueueOptions} [options]
   */
  constructor(options = {}) {
    super('Transfer');
    this.metadata.useDynamic = false;
    options.toString();
  }
};
