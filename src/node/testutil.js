module.exports.UUID_REGEXP = /^[a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12}$/;

module.exports.getParameter = (node, name) => node.parameters.find((p) => p.name === name);
