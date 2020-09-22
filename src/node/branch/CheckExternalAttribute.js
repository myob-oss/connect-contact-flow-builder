const { v4: uuid } = require('uuid');
const ContactFlowNode = require('../AbstractNode');

/**
 * @typedef CheckExternalAttributeOptions
 * @property {string} externalAttributeName
 */

module.exports = class CheckExternalAttribute extends ContactFlowNode {
  /**
   * @param {CheckExternalAttributeOptions} [options]
   */
  constructor(options = {}) {
    super('CheckAttribute');
    this.setNoMatchBranch(null);
    this.setParameter('Attribute', options.externalAttributeName);
    this.setParameter('Namespace', 'External');
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {CheckExternalAttribute}
   */
  setNoMatchBranch = node => this.setBranch('NoMatch', node);

  /**
   * @param {string} matchValue
   * @param {ContactFlowNode} node
   * @returns {CheckExternalAttribute}
   */
  addEqualsBranch = (matchValue, node) => this.addBranch({
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
