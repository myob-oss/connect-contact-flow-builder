const ContactFlowNode = require('./ContactFlowNode');

module.exports = class Disconnect extends ContactFlowNode {
  constructor() {
    super('Disconnect');
  }
};
