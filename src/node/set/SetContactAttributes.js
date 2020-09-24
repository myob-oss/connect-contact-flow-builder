const { isDynamicValue } = require('../dynamicValue');
const ContactFlowNode = require('../AbstractNode');

/**
 * @typedef SetContactAttributesAttribute
 * @property {string} destinationKey
 * @property {string|DynamicValue} value
 */

/**
 * @typedef SetContactAttributesOptions
 * @property {AbstractNode} [successBranch]
 * @property {AbstractNode} [errorBranch]
 * @property {SetContactAttributesAttribute[]} [attributes]
 */

module.exports = class SetContactAttributes extends ContactFlowNode {
  /**
   * @param {SetContactAttributesOptions} [options]
   */
  constructor(options = {}) {
    super('SetAttributes');
    this.setSuccessBranch(options.successBranch || null);
    this.setErrorBranch(options.errorBranch || null);
    if (Array.isArray(options.attributes)) {
      options.attributes.forEach((attribute) => {
        if (isDynamicValue(attribute.value)) {
          this.addDynamicAttribute(
            attribute.destinationKey,
            attribute.value,
          );
        } else {
          this.addTextAttribute(
            attribute.destinationKey,
            attribute.value,
          );
        }
      });
    }
  }

  /**
   * @param {AbstractNode} node
   * @returns {SetContactAttributes}
   */
  setSuccessBranch(node) {
    return this.setBranch('Success', node);
  }

  /**
   * @param {AbstractNode} node
   * @returns {SetContactAttributes}
   */
  setErrorBranch(node) {
    return this.setBranch('Error', node);
  }

  /**
   * @param {string} destinationKey
   * @param {string} value
   * @returns {SetContactAttributes}
   */
  addTextAttribute(destinationKey, value) {
    return this.addParameter('Attribute', { key: destinationKey, value });
  }

  /**
   * @param {string} destinationKey
   * @param {DynamicValue} value
   * @returns {SetContactAttributes}
   */
  addDynamicAttribute(destinationKey, value) {
    return this.addParameter('Attribute', { key: destinationKey, ...value });
  }
};
