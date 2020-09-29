const { numberWithFallback, booleanWithFallback } = require('../parseUtil');
const { isDynamicValue } = require('../dynamicValue');
const AbstractNode = require('../AbstractNode');

/**
 * @typedef TransferToPhoneNumberOptions
 * @property {CountryDialCode} [localCountryCode]
 * @property {string|DynamicValue} [phoneNumber]
 * @property {number|DynamicValue} [timeout] - Defaults to {30}
 * @property {boolean} [resumeAfterDisconnect] - Defaults to {true}
 * @property {AbstractNode} [successBranch]
 * @property {AbstractNode} [callFailedBranch]
 * @property {AbstractNode} [timeoutBranch]
 * @property {AbstractNode} [errorBranch]
 */

module.exports = class TransferToPhoneNumber extends AbstractNode {
  /**
   * @param {TransferToPhoneNumberOptions} [options]
   */
  constructor(options = {}) {
    super('Transfer');
    this.target = 'PhoneNumber';
    this.setSuccessBranch(options.successBranch || null);
    this.setCallFailedBranch(options.callFailedBranch || null);
    this.setTimeoutBranch(options.timeoutBranch || null);
    this.setErrorBranch(options.errorBranch || null);
    this.setTimeout(isDynamicValue(options.timeout)
      ? options.timeout
      : numberWithFallback(options.timeout, 30));
    this.setResumeAfterDisconnect(booleanWithFallback(options.resumeAfterDisconnect, true));
    if (options.phoneNumber) {
      this.setPhoneNumber(options.phoneNumber, options.localCountryCode);
    }
  }

  /**
   * @param {string|DynamicValue} phoneNumber
   * @param {CountryDialCode} [localCountryCode]
   * @returns {this}
   */
  setPhoneNumber(phoneNumber, localCountryCode) {
    if (localCountryCode) {
      this.metadata.CountryCode = localCountryCode.countryAcronym.toLowerCase();
    }
    return this.setParameter('PhoneNumber', phoneNumber);
  }

  /**
   * @param {number|DynamicValue} timeout
   * @returns {this}
   */
  setTimeout(timeout) {
    return this.setParameter(
      'TimeLimit',
      isDynamicValue(timeout) ? timeout : timeout.toString(),
    );
  }

  setResumeAfterDisconnect(resumeAfterDisconnect) {
    return this.setParameter('BlindTransfer', !resumeAfterDisconnect);
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
  setCallFailedBranch(node) {
    return this.setBranch('CallFailure', node);
  }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setTimeoutBranch(node) {
    return this.setBranch('Timeout', node);
  }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setErrorBranch(node) {
    return this.setBranch('Error', node);
  }

  /**
   * @returns {BuiltContactFlowNode}
   */
  build() {
    const result = super.build();
    const { value: isBlindTransfer } = result.parameters.find(({ name }) => name === 'BlindTransfer');
    if (isBlindTransfer) {
      result.branches = result.branches.filter(({ condition }) => condition !== 'Success'
        && condition !== 'CallFailure'
        && condition !== 'Timeout');
    }
    return result;
  }
};
