const { PlayPrompt, DisconnectHangUp } = require('../src');

module.exports = (companyName) => {
  const mainNode = new PlayPrompt({
    text: `Welcome to ${companyName}!`,
  });
  const disconnect = new DisconnectHangUp();
  mainNode.setSuccessBranch(disconnect);

  return mainNode;
};
