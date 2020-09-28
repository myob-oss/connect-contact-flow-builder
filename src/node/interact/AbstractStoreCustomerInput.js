const CountryDialCode = require('../CountryDialCode');
const PlayPrompt = require('./PlayPrompt');

/**
 * @typedef {PlayPromptOptions} StoreCustomerInputOptions
 * @property {AbstractNode} [errorBranch]
 * @property {number} [firstEntryTimeLimit] - In seconds; defaults to {5}
 */

module.exports = class AbstractStoreCustomerInput extends PlayPrompt {
  /**
   * @param {StoreCustomerInputOptions} [options]
   */
  constructor(options = {}) {
    super(options);
    this.type = 'StoreUserInput';
    this.metadata.useDynamicForEncryptionKeys = true;
    this.metadata.useDynamicForTerminatorDigits = false;
    this.metadata.countryCodePrefix = CountryDialCode.US.dialCode;
    this.setErrorBranch(options.errorBranch || null);
    this.setFirstEntryTimeLimit(
      options.firstEntryTimeLimit || options.firstEntryTimeLimit === 0
        ? options.firstEntryTimeLimit
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

  setFirstEntryTimeLimit(timeLimit) {
    return this.setParameter('Timeout', timeLimit.toString());
  }
};
