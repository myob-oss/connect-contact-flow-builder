const ContactFlowNode = require('./ContactFlowNode');

module.exports = class SetAttributesNode extends ContactFlowNode {
  constructor() {
    super('SetAttributes');
    this.setSuccessBranch(null);
    this.setErrorBranch(null);
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {SetAttributesNode}
   */
  setSuccessBranch = node => this.setBranch('Success', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {SetAttributesNode}
   */
  setErrorBranch = node => this.setBranch('Error', node);

  /**
   * @param {string} destination
   * @param {string} value
   * @returns {SetAttributesNode}
   */
  setTextAttribute = (destination, value) => this.addParameter('Attribute', {
    key: destination,
    value,
  });

  /**
   * @param {string} destinationKey
   * @param {string} sourceKey
   * @returns {SetAttributesNode}
   */
  setDynamicExternalAttribute = (destinationKey, sourceKey) => this.addParameter('Attribute', {
    key: destinationKey,
    namespace: 'External',
    value: sourceKey,
  });

  /**
   * @param {string} destinationKey
   * @param {string} sourceKey
   * @returns {SetAttributesNode}
   */
  setDynamicSystemAttribute = (destinationKey, sourceKey) => this.addParameter('Attribute', {
    value: sourceKey,
    namespace: 'System',
    key: destinationKey,
  });
}