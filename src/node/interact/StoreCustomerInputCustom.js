const { isDynamicValue } = require('../dynamicValue');
const AbstractStoreCustomerInput = require('./AbstractStoreCustomerInput');

/**
 * @typedef {AbstractStoreCustomerInputOptions} StoreCustomerInputCustomOptions
 * @property {number} [maximumDigits] - Defaults to {20}
 * @property {string|DynamicValue} [encryptionKeyId]
 * @property {string|DynamicValue} [encryptionKey]
 * @property {boolean} [disableCancelKey]
 * @property {string} [terminatingKeypress]
 */

const TERMINATING_KEYPRESS_INVALID_CHARACTER_REGEX = /[^0-9#*]/;

module.exports = class StoreCustomerInputCustom extends AbstractStoreCustomerInput {
  /**
   * @param {StoreCustomerInputCustomOptions} [options]
   */
  constructor(options = {}) {
    super(options);
    this.metadata.useDynamicForEncryptionKeys = false;
    this.metadata.useDynamicForTerminatorDigits = false;
    this.setParameter('CustomerInputType', 'Custom');
    this.setMaximumDigits(options.maximumDigits === 0 ? 0 : options.maximumDigits || 20);
    this.setDisableCancelKey(!!options.disableCancelKey);
    this.setParameter('EncryptEntry', false);
    if (options.encryptionKeyId || options.encryptionKey) {
      this.setEncryption(options.encryptionKeyId, options.encryptionKey);
    }
    if (options.terminatingKeypress) {
      this.setTerminatingKeypress(options.terminatingKeypress);
    }
  }

  /**
   * @param {number} maxDigits
   * @returns {this}
   */
  setMaximumDigits(maxDigits) {
    return this.setParameter('MaxDigits', maxDigits);
  }

  /**
   * @param {string|DynamicValue} encryptionKeyId
   * @param {string|DynamicValue} encryptionKey
   * @returns {this}
   */
  setEncryption(encryptionKeyId, encryptionKey) {
    if (!encryptionKeyId || !encryptionKey
      || isDynamicValue(encryptionKeyId) !== isDynamicValue(encryptionKey)) {
      throw new Error('Validation error: encryptionKeyId and encryptionKey must both be strings '
        + 'or both be DynamicValues');
    }
    this.metadata.useDynamicForEncryptionKeys = isDynamicValue(encryptionKeyId);
    return this
      .setParameter('EncryptEntry', true)
      .setParameter('EncryptionKeyId', encryptionKeyId)
      .setParameter('EncryptionKey', encryptionKey);
  }

  /**
   * @param {boolean} disableCancelKey
   * @returns {this}
   */
  setDisableCancelKey(disableCancelKey) {
    return this.setParameter('DisableCancel', disableCancelKey);
  }

  /**
   * @param {string} terminatingKeypress
   * @returns {StoreCustomerInputCustom}
   */
  setTerminatingKeypress(terminatingKeypress) {
    if (isDynamicValue(terminatingKeypress)) {
      this.metadata.useDynamicForTerminatorDigits = true;
    } else if (terminatingKeypress.length > 5) {
      throw new Error('Validation error: terminatingKeypress is longer than 5 characters');
    } else if (TERMINATING_KEYPRESS_INVALID_CHARACTER_REGEX.test(terminatingKeypress)) {
      throw new Error('Validation error: terminatingKeypress may only contain 0-9, # or *');
    }
    return this.setParameter('TerminatorDigits', terminatingKeypress);
  }
};
