const ContactFlowNode = require('../AbstractNode');

/**
 * @typedef TransferOptions
 * @property {number} [timeLimit] - Defaults to {30}.
 * @property {string} [phoneNumber]
 * @property {string} [phoneNumberExternalAttribute]
 * @property {ContactFlowNode} [errorBranch]
 */

module.exports = class Transfer extends ContactFlowNode {
  /**
   * @param {TransferOptions} [options]
   */
  constructor(options = {}) {
    super('Transfer');
    this.target = 'PhoneNumber';
    this.setTimeLimit(options.timeLimit || 30);
    this.setBlindTransfer(true);
    if (options.phoneNumber) {
      this.setPhoneNumber(options.phoneNumber);
    } else if (options.phoneNumberExternalAttribute) {
      this.setPhoneNumberExternalAttribute(options.phoneNumberExternalAttribute);
    }
    this.setErrorBranch(options.errorBranch || null);
  }

  /**
   * @param {number} timeLimit
   * @returns {Transfer}
   */
  setTimeLimit = (timeLimit) => this.setParameter('TimeLimit', timeLimit.toString());

  /**
   * @param {boolean} isBlindTransfer
   */
  setBlindTransfer = (isBlindTransfer) => this.setParameter('BlindTransfer', isBlindTransfer);

  /**
   * @param {string} phoneNumber
   * @returns {Transfer}
   */
  setPhoneNumber = (phoneNumber) => this.setParameter('PhoneNumber', phoneNumber);

  /**
   * @param {string} externalAttributeName
   * @returns {Transfer}
   */
  setPhoneNumberExternalAttribute = (externalAttributeName) => this.setParameter('PhoneNumber', {
    value: externalAttributeName,
    namespace: 'External',
  });

  /**
   * @param {ContactFlowNode} node
   * @returns {Transfer}
   */
  setErrorBranch = node => this.setBranch('Error', node);
};
