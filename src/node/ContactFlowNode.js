const { v4: uuid } = require('uuid');

/**
 * @typedef ContactFlowBranch
 * @property {BranchCondition} condition
 * @property {ContactFlowNode} node
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
 * @typedef {ContactFlowNode} BuiltContactFlowNode
 * @property {BuiltContactFlowBranch[]} branches
 * @property {{}} metadata
 */

/**
 * @class ContactFlowNode
 * @property {string} id
 * @property {string} type
 * @property {ContactFlowBranch[]} branches
 * @property {ContactFlowParameter[]} parameters
 * @property {*} metadata
 */
module.exports = class ContactFlowNode {
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
   * @returns {BranchCondition}
   * @private
   */
  __normalizeBranchCondition(condition) {
    if (typeof condition === 'string') {
      return { condition };
    }
    return condition;
  }

  /**
   * @param {BranchCondition|string} condition
   * @param {ContactFlowNode} node
   * @returns {ContactFlowNode}
   */
  setBranch(condition, node) {
    condition = this.__normalizeBranchCondition(condition);
    const existingIndex = this.branches.findIndex(branch => branch.condition.condition === condition.condition);
    if (existingIndex >= 0) {
      this.branches[existingIndex] = { condition, node };
      return this;
    }
    return this.addBranch(condition, node);
  }

  /**
   * @param {BranchCondition|string} condition
   * @param {ContactFlowNode} node
   * @returns {ContactFlowNode}
   */
  addBranch(condition, node) {
    condition = this.__normalizeBranchCondition(condition);
    this.branches.push({ condition, node });
    return this;
  }

  /**
   * @param {string|ContactFlowParameter} value
   * @returns {ContactFlowParameter}
   * @private
   */
  __normalizeParameterValue(value) {
    if (typeof value === 'object') {
      return value;
    }
    return { value };
  }

  /**
   * @param {string} name
   * @param {ContactFlowParameter|string|number|boolean} value
   * @returns {ContactFlowNode}
   */
  setParameter(name, value) {
    value = this.__normalizeParameterValue(value);
    const existingIndex = this.parameters.findIndex(parameter => parameter.name === name);
    if (existingIndex >= 0) {
      this.parameters[existingIndex] = { name, ...value };
      return this;
    }
    return this.addParameter(name, value);
  }

  /**
   * @param {string} name
   * @param {ContactFlowParameter|string|number|boolean} value
   * @returns {ContactFlowNode}
   */
  addParameter(name, value) {
    value = this.__normalizeParameterValue(value);
    this.parameters.push({ name, ...value });
    return this;
  }

  /**
   * @returns {BuiltContactFlowNode}
   */
  build() {
    return {
      ...this,
      branches: this.branches.map(({ condition, node }) => ({ ...condition, transition: node && node.id })),
    };
  }
};
