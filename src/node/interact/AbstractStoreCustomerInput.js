const PlayPrompt = require('./PlayPrompt');

/**
 * @typedef {PlayPromptOptions} AbstractStoreCustomerInputOptions
 * @property {AbstractNode} [errorBranch]
 * @property {number} [timeoutBeforeFirstEntry] - In seconds; defaults to {5}
 */

module.exports = class AbstractStoreCustomerInput extends PlayPrompt {
  /**
   * @param {AbstractStoreCustomerInputOptions} [options]
   */
  constructor(options = {}) {
    super(options);
    this.type = 'StoreUserInput';
    this.setErrorBranch(options.errorBranch || null);
    this.setTimeoutBeforeFirstEntry(
      options.timeoutBeforeFirstEntry || options.timeoutBeforeFirstEntry === 0
        ? options.timeoutBeforeFirstEntry
        : 5,
    );
  }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setErrorBranch(node) {
    return this.setBranch('Error', node);
  }

  setTimeoutBeforeFirstEntry(timeLimit) {
    return this.setParameter('Timeout', timeLimit.toString());
  }
};
