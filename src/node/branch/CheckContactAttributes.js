const { v4: uuid } = require('uuid');
const { isDynamicValue } = require('../dynamicValue');
const ContactFlowNode = require('../AbstractNode');

function addEvaluateBranch(that, options, value, node) {
  const { type, name, shortDisplay } = options;
  const conditionValue = value;
  that.addBranch({
    condition: 'Evaluate',
    conditionType: type,
    conditionValue,
  }, node);
  that.metadata.conditionMetadata.push({
    id: uuid(),
    operator: { name, value: type, shortDisplay },
    value,
  });
  return that;
}

/**
 * @typedef CheckContactAttributesOptions
 * @property {DynamicValue} [checkValue]
 * @property {AbstractNode} [noMatchBranch]
 */

module.exports = class CheckContactAttributes extends ContactFlowNode {
  /**
   * @param {CheckContactAttributesOptions} [options]
   */
  constructor(options = {}) {
    super('CheckAttribute');
    if (options.checkValue) {
      this.setCheckValue(options.checkValue);
    }
    this.metadata.conditionMetadata = [];
    if (options.noMatchBranch) {
      this.setNoMatchBranch(options.noMatchBranch);
    }
  }

  /**
   * @param {DynamicValue} checkValue
   * @returns {CheckContactAttributes}
   */
  setCheckValue(checkValue) {
    if (!isDynamicValue(checkValue)) {
      throw new Error('Validation error: checkValue must be a DynamicValue');
    }
    const { namespace, value } = checkValue;
    this.setParameter('Attribute', value);
    this.setParameter('Namespace', namespace);
    return this;
  }

  /**
   * @param {AbstractNode} node
   * @returns {CheckContactAttributes}
   */
  setNoMatchBranch(node) {
    return this.setBranch('NoMatch', node);
  }

  /**
   * @param {string|number} value
   * @param {AbstractNode} node
   * @returns {CheckContactAttributes}
   */
  addEqualsBranch(value, node) {
    return addEvaluateBranch(this, {
      type: 'Equals',
      name: 'Equals',
      shortDisplay: '=',
    }, (value || '').toString(), node);
  }

  /**
   * @param {string|number} value
   * @param {AbstractNode} node
   * @returns {CheckContactAttributes}
   */
  addLessThanBranch(value, node) {
    return addEvaluateBranch(this, {
      type: 'LessThan',
      name: 'Is less than',
      shortDisplay: '<',
    }, value.toString(), node);
  }

  /**
   * @param {string|number} value
   * @param {AbstractNode} node
   * @returns {CheckContactAttributes}
   */
  addLessThanOrEqualToBranch(value, node) {
    return addEvaluateBranch(this, {
      type: 'LessThanOrEqualTo',
      name: 'Is less or equal',
      shortDisplay: '<=',
    }, value.toString(), node);
  }

  /**
   * @param {string|number} value
   * @param {AbstractNode} node
   * @returns {CheckContactAttributes}
   */
  addGreaterThanBranch(value, node) {
    return addEvaluateBranch(this, {
      type: 'GreaterThan',
      name: 'Is greater than',
      shortDisplay: '>',
    }, value.toString(), node);
  }

  /**
   * @param {string|number} value
   * @param {AbstractNode} node
   * @returns {CheckContactAttributes}
   */
  addGreaterThanOrEqualToBranch(value, node) {
    return addEvaluateBranch(this, {
      type: 'GreaterThanOrEqualTo',
      name: 'Is greater or equal',
      shortDisplay: '>=',
    }, value.toString(), node);
  }

  /**
   * @param {string} value
   * @param {AbstractNode} node
   * @returns {CheckContactAttributes}
   */
  addStartsWithBranch(value, node) {
    return addEvaluateBranch(this, {
      type: 'StartsWith',
      name: 'Starts with',
      shortDisplay: 'starts with',
    }, value, node);
  }

  /**
   * @param {string} value
   * @param {AbstractNode} node
   * @returns {CheckContactAttributes}
   */
  addEndsWithBranch(value, node) {
    return addEvaluateBranch(this, {
      type: 'EndsWith',
      name: 'Ends with',
      shortDisplay: 'ends with',
    }, value, node);
  }

  /**
   * @param {string} value
   * @param {AbstractNode} node
   * @returns {CheckContactAttributes}
   */
  addContainsBranch(value, node) {
    return addEvaluateBranch(this, {
      type: 'Contains',
      name: 'Contains',
      shortDisplay: 'contains',
    }, value, node);
  }
};
