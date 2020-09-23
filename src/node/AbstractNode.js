const { v4: uuid } = require('uuid');

/**
 * @typedef ContactFlowBranch
 * @property {BranchCondition} condition
 * @property {AbstractNode} node
 */

/**
 * @typedef {BranchCondition} BuiltContactFlowBranch
 * @property {string|null} transition
 */

/**
 * @typedef ContactFlowParameter
 * @property {string} value
 */

/**
 * @typedef {AbstractNode} BuiltContactFlowNode
 * @property {BuiltContactFlowBranch[]} branches
 * @property {{}} metadata
 */

/**
 * @param {BranchCondition|string} condition
 * @returns {BranchCondition}
 * @private
 */
function normalizeBranchCondition(condition) {
  if (typeof condition === 'string') {
    return { condition };
  }
  return condition;
}

/**
 * @param {string|ContactFlowParameter} value
 * @returns {ContactFlowParameter}
 * @private
 */
function normalizeParameterValue(value) {
  if (typeof value === 'object') {
    return value;
  }
  return { value };
}

/**
 * @class AbstractNode
 * @property {string} id
 * @property {string} type
 * @property {ContactFlowBranch[]} branches
 * @property {ContactFlowParameter[]} parameters
 * @property {*} metadata
 * @property {Function} build
 */
module.exports = class AbstractNode {
  constructor(type) {
    this.id = uuid();
    this.type = type;
    this.branches = [];
    this.parameters = [];
    this.metadata = {};
  }

  /**
   * @typedef BranchCondition
   * @property {string} condition
   * @property {string} [conditionType]
   * @property {string} [conditionValue]
   */

  /**
   * @param {BranchCondition|string} condition
   * @param {AbstractNode} node
   * @returns {this}
   */
  setBranch(condition, node) {
    const normalizedCondition = normalizeBranchCondition(condition);
    const existingIndex = this.branches.findIndex((branch) => {
      const branchCondition = branch.condition.condition;
      const testCondition = normalizedCondition.condition;
      return branchCondition === testCondition;
    });
    if (existingIndex >= 0) {
      this.branches[existingIndex] = { condition: normalizedCondition, node };
      return this;
    }
    return this.addBranch(normalizedCondition, node);
  }

  /**
   * @param {BranchCondition|string} condition
   * @param {AbstractNode} node
   * @returns {this}
   */
  addBranch(condition, node) {
    const normalizedCondition = normalizeBranchCondition(condition);
    this.branches.push({ condition: normalizedCondition, node });
    return this;
  }

  /**
   * @param {string} name
   * @param {ContactFlowParameter|string|number|boolean} value
   * @returns {this}
   */
  setParameter(name, value) {
    const normalizedValue = normalizeParameterValue(value);
    const existingIndex = this.parameters.findIndex((parameter) => parameter.name === name);
    if (existingIndex >= 0) {
      this.parameters[existingIndex] = { name, ...normalizedValue };
      return this;
    }
    return this.addParameter(name, normalizedValue);
  }

  /**
   * @param {string} name
   * @param {ContactFlowParameter|string|number|boolean} value
   * @returns {this}
   */
  addParameter(name, value) {
    const normalizedValue = normalizeParameterValue(value);
    this.parameters.push({ name, ...normalizedValue });
    return this;
  }

  /**
   * @returns {BuiltContactFlowNode}
   */
  build() {
    return {
      ...this,
      branches: this.branches.map(({ condition, node }) => ({
        ...condition,
        transition: node && node.id,
      })),
    };
  }
};
