const COLUMN_COUNT = 6;

function buildContactFlow(startNode) {
  let index = -1;

  /**
   * @param {ContactFlowNode|null} node
   * @returns {BuiltContactFlowNode}
   */
  function mapNode(node) {
    index++;
    const builtNode = node.build();

    return {
      ...builtNode,
      metadata: {
        position: {
          x: 15.5 + 150 + 250 * (index % COLUMN_COUNT),
          y: 15.5 + 250 * Math.floor(index / COLUMN_COUNT),
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
      name: '*Actually Generated',
      description: null,
      type: 'contactFlow',
      status: 'saved',
    }
  };
}

module.exports = { buildContactFlow };
