const { v4: uuid } = require('uuid');
const ContactFlowNode = require('./ContactFlowNode');

module.exports = class CheckExternalAttributeNode extends ContactFlowNode {
  constructor(attributeName) {
    super('CheckAttribute');
    this.setNoMatchBranch(null);
    this.setParameter('Attribute', attributeName);
    this.setParameter('Namespace', 'External');
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {CheckExternalAttributeNode}
   */
  setNoMatchBranch = node => this.setBranch('NoMatch', node);

  /**
   * @param {string} matchValue
   * @param {ContactFlowNode} node
   * @returns {CheckExternalAttributeNode}
   */
  setEqualsBranch = (matchValue, node) => this.addBranch({
    condition: 'Evaluate',
    conditionType: 'Equals',
    conditionValue: matchValue,
  }, node);

  build() {
    return {
      ...super.build(),
      metadata: {
        conditionMetadata: this.branches
          .filter(({ condition }) => condition.condition === 'Evaluate')
          .map(({ condition }) => ({
            id: uuid(),
            operator: {
              name: condition.conditionType,
              value: condition.conditionType,
              shortDisplay: condition.conditionType === 'Equals' ? '=' : '???',
            },
            value: condition.conditionValue,
          })),
      },
    };
  }
};
