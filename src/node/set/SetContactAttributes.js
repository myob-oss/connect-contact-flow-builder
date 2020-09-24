const ContactFlowNode = require('../AbstractNode');

/**
 * @typedef SetAttributesTextAttribute
 * @property {string} destinationKey
 * @property {string} value
 */

/**
 * @typedef SetAttributesDynamicAttribute
 * @property {string} destinationKey
 * @property {DynamicValue} value
 */

/**
 * @typedef SetAttributesOptions
 * @property {ContactFlowNode} [successBranch]
 * @property {ContactFlowNode} [errorBranch]
 * @property {SetAttributesTextAttribute[]} [textAttributes]
 * @property {SetAttributesDynamicAttribute[]} [dynamicAttributes]
 */

module.exports = class SetAttributes extends ContactFlowNode {
  /**
   * @param {SetAttributesOptions} [options]
   */
  constructor(options = {}) {
    super('SetAttributes');
    this.setSuccessBranch(options.successBranch || null);
    this.setErrorBranch(options.errorBranch || null);
    if (Array.isArray(options.textAttributes)) {
      options.textAttributes.forEach((attribute) => this.addTextAttribute(
        attribute.destinationKey,
        attribute.value,
      ));
    }
    if (Array.isArray(options.dynamicAttributes)) {
      options.dynamicAttributes.forEach((attribute) => this.addDynamicAttribute(
        attribute.destinationKey,
        attribute.value,
      ));
    }
  }

  /**
   * @param {AbstractNode} node
   * @returns {SetAttributes}
   */
  setSuccessBranch(node) {
    return this.setBranch('Success', node);
  }

  /**
   * @param {AbstractNode} node
   * @returns {SetAttributes}
   */
  setErrorBranch(node) {
    return this.setBranch('Error', node);
  }

  /**
   * @param {string} destinationKey
   * @param {string} value
   * @returns {SetAttributes}
   */
  addTextAttribute(destinationKey, value) {
    return this.addParameter('Attribute', { key: destinationKey, value });
  }

  /**
   * @param {string} destinationKey
   * @param {DynamicValue} value
   * @returns {SetAttributes}
   */
  addDynamicAttribute(destinationKey, value) {
    return this.addParameter('Attribute', { key: destinationKey, ...value });
  }
};
