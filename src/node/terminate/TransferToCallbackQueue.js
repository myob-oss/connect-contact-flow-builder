const { numberWithFallback } = require('../parseUtil');
const AbstractSetWorkingQueue = require('../AbstractSetWorkingQueue');

/**
 * @typedef TransferToCallbackQueueOptions
 * @property {number} [initialDelay]
 * @property {number} [minTimeBetweenAttempts]
 * @property {number} [maxNumberOfRetries]
 * @property {string} [queueArn]
 * @property {string} [agentArn]
 * @property {string} [displayName]
 * @property {AbstractNode} [successBranch]
 * @property {AbstractNode} [errorBranch]
 */

module.exports = class TransferToCallbackQueue extends AbstractSetWorkingQueue {
  /**
   * @param {TransferToCallbackQueueOptions} [options]
   */
  constructor(options = {}) {
    super('CreateCallback');
    this.metadata.useDynamic = false;
    this.setSuccessBranch(options.successBranch || null);
    this.setErrorBranch(options.errorBranch || null);
    this.setInitialDelay(numberWithFallback(options.initialDelay, 99));
    this.setMinTimeBetweenAttempts(numberWithFallback(options.minTimeBetweenAttempts, 600));
    this.setMaxNumberOfRetries(numberWithFallback(options.maxNumberOfRetries, 1));
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
  setSuccessBranch(node) { return this.setBranch('Success', node); }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setErrorBranch(node) { return this.setBranch('Error', node); }

  /**
   * @param {number} initialDelay
   * @returns {this}
   */
  setInitialDelay(initialDelay) {
    return this.setParameter('InitialDelaySeconds', initialDelay);
  }

  /**
   * @param {number} value
   * @returns {this}
   */
  setMaxNumberOfRetries(value) {
    return this.setParameter('MaxRetryAttempts', value);
  }

  /**
   * @param {number} value
   * @returns {this}
   */
  setMinTimeBetweenAttempts(value) {
    return this.setParameter('RetryDelaySeconds', value);
  }
};
