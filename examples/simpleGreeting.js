const { PlayPrompt, Disconnect } = require('../src');

module.exports = (companyName) => {
  const mainNode = new PlayPrompt({
    text: `Welcome to ${companyName}!`,
  });
  const disconnect = new Disconnect();
  mainNode.setSuccessBranch(disconnect);

  return mainNode
};
