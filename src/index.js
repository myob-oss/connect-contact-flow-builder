const COLUMN_COUNT = 6;
const NODE_POSITION = {
  xOffset: 15.5 + 150,
  xMultiplier: 250,
  yOffset: 15.5,
  yMultiplier: 250,
};

class ModulesBuilder {
  constructor(startIndex) {
    this.startIndex = startIndex;
  }

  reset() {
    this.index = this.startIndex;
    this.visitedIds = new Set();
    this.modules = [];
  }

  /**
   * @param {AbstractNode} [node]
   * @returns {BuiltContactFlowNode|null}
   */
  mapNode(node) {
    if (!node) {
      return null;
    }

    this.index += 1;
    const builtNode = node.build();
    const xPosition = this.index < 0 ? this.index + 3 : ((this.index % COLUMN_COUNT) + 3);
    const yPosition = Math.floor(this.index < 0 ? 0 : this.index / COLUMN_COUNT);
    return {
      ...builtNode,
      metadata: {
        position: {
          x: NODE_POSITION.xOffset + NODE_POSITION.xMultiplier * xPosition,
          y: NODE_POSITION.yOffset + NODE_POSITION.yMultiplier * yPosition,
        },
        ...builtNode.metadata,
      },
    };
  }

  addAndWalkBranches(node) {
    if (!node || !node.id || this.visitedIds.has(node.id)) {
      return;
    }

    this.visitedIds.add(node.id);
    this.modules.push(this.mapNode(node));
    node.branches.forEach((branch) => branch.node && this.addAndWalkBranches(branch.node));
  }

  buildModules(rootNode) {
    this.reset();
    this.addAndWalkBranches(rootNode);
    return this.modules;
  }
}

/**
 * @param {string} flowName
 * @param {AbstractNode} startNode
 * @returns {Object|ErrorResult}
 */
function buildContactFlow(flowName, startNode) {
  try {
    return {
      modules: new ModulesBuilder(-4).buildModules(startNode),
      version: '1',
      type: 'contactFlow',
      start: startNode.id,
      metadata: {
        entryPointPosition: { x: 15.5, y: 15.5 },
        snapToGrid: false,
        name: flowName,
        description: null,
        type: 'contactFlow',
        status: 'saved',
      },
    };
  } catch (error) {
    return { message: 'There was an error while building the contact flow', innerError: error };
  }
}

/* eslint-disable global-require */

module.exports = buildContactFlow;
module.exports.CountryDialCode = require('./node/CountryDialCode');
module.exports.dynamicValue = require('./node/dynamicValue');

// Interact
module.exports.PlayPrompt = require('./node/interact/PlayPrompt');

module.exports.StoreCustomerInput = {
  PhoneInput: require('./node/interact/StoreCustomerInputPhone'),
  CustomInput: require('./node/interact/StoreCustomerInputCustom'),
};

// Set
module.exports.SetWorkingQueue = require('./node/set/SetWorkingQueue');
module.exports.SetContactAttributes = require('./node/set/SetContactAttributes');

// Branch
module.exports.CheckContactAttributes = require('./node/branch/CheckContactAttributes');

// Integrate
module.exports.InvokeAWSLambdaFunction = require('./node/integrate/InvokeAWSLambdaFunction');

// Terminate / Transfer
module.exports.DisconnectHangUp = require('./node/terminate/DisconnectHangUp');

module.exports.TransferToQueue = {
  WorkingQueue: require('./node/terminate/TransferToWorkingQueue'),
  CallbackQueue: require('./node/terminate/TransferToCallbackQueue'),
};
module.exports.TransferToPhoneNumber = require('./node/terminate/TransferToPhoneNumber');
