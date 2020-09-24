module.exports = {
  UUID_REGEXP: /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/,
  getParameter: (node, name) => node.parameters.find((p) => p.name === name),
  getParameters: (node, name) => node.parameters.filter((p) => p.name === name),
  getBranch: (node, condition) => node.branches.find((p) => p.condition === condition),
};
