const COLUMN_COUNT = 6;

/**
 * @param {string} flowName
 * @param {ContactFlowNode} startNode
 * @returns {*}
 */
function buildContactFlow(flowName, startNode) {
  let index = -4;

  /**
   * @param {ContactFlowNode|null} node
   * @returns {BuiltContactFlowNode}
   */
  function mapNode(node) {
    index++;
    const builtNode = node && node.build();

    return {
      ...builtNode,
      metadata: {
        position: {
          x: 15.5 + 150 + 250 * (index < 0 ? index + 3 : (index % COLUMN_COUNT + 3)),
          y: 15.5 + 250 * Math.floor(index < 0 ? 0 : index / COLUMN_COUNT),
        },
        ...builtNode.metadata,
      },
    };
  }

  const modules = [];
  const visited = {};
  function addAndWalkBranches(node) {
    if (!node || !node.id || visited[node.id]) return;
    visited[node.id] = true;
    modules.push(mapNode(node));
    node.branches.forEach(({ node }) => node && addAndWalkBranches(node));
  }
  addAndWalkBranches(startNode);

  return {
    modules,
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
    }
  };
}

module.exports = buildContactFlow;
module.exports.PlayPrompt = require('./node/PlayPrompt');
module.exports.Disconnect = require('./node/Disconnect');
module.exports.SetAttributes = require('./node/SetAttributes');
module.exports.InvokeExternalResource = require('./node/InvokeExternalResource');
module.exports.CheckExternalAttribute = require('./node/CheckExternalAttribute');
module.exports.SetWorkingQueue = require('./node/SetWorkingQueue');
module.exports.TransferToQueue = require('./node/TransferToQueue');
module.exports.StoreUserInputCustom = require('./node/StoreUserInput').StoreUserInputCustom;
module.exports.StoreUserInputPhone = require('./node/StoreUserInput').StoreUserInputPhone;
module.exports.GetCustomerInput = require('./node/GetCustomerInput');
module.exports.Transfer = require('./node/Transfer');
