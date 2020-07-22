const ContactFlowNode = require('./ContactFlowNode');

/**
 * @typedef SetAttributesOptions
 * @property {ContactFlowNode} [successBranch]
 * @property {ContactFlowNode} [errorBranch]
 */

module.exports = class SetAttributes extends ContactFlowNode {
  /**
   *
   * @param {SetAttributesOptions} [options]
   */
  constructor(options = {}) {
    super('SetAttributes');
    this.setSuccessBranch(options.successBranch || null);
    this.setErrorBranch(options.errorBranch || null);
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {SetAttributes}
   */
  setSuccessBranch = node => this.setBranch('Success', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {SetAttributes}
   */
  setErrorBranch = node => this.setBranch('Error', node);

  /**
   * @param {string} destination
   * @param {string} value
   * @returns {SetAttributes}
   */
  addTextAttribute = (destination, value) => this.addParameter('Attribute', {
    key: destination,
    value,
  });

  /**
   * @param {string} destinationKey
   * @param {string} sourceKey
   * @returns {SetAttributes}
   */
  addDynamicExternalAttribute = (destinationKey, sourceKey) => this.addParameter('Attribute', {
    key: destinationKey,
    namespace: 'External',
    value: sourceKey,
  });

  /**
   * @param {string} destinationKey
   * @param {string} sourceKey
   * @returns {SetAttributes}
   */
  addDynamicSystemAttribute = (destinationKey, sourceKey) => this.addParameter('Attribute', {
    value: sourceKey,
    namespace: 'System',
    key: destinationKey,
  });
};
