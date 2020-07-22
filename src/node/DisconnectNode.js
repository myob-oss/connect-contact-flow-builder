const ContactFlowNode = require('./ContactFlowNode');

module.exports = class DisconnectNode extends ContactFlowNode {
  constructor() {
    super('Disconnect');
  }
};
