module.exports = {
  ContactFlowNode: require('./ContactFlowNode'),
  PlayPromptNode: require('./PlayPromptNode'),
  InvokeExternalResourceNode: require('./InvokeExternalResourceNode'),
  SetAttributesNode: require('./SetAttributesNode'),
  DisconnectNode: require('./DisconnectNode'),
  CheckExternalAttributeNode: require('./CheckExternalAttributeNode'),
  SetWorkingQueueNode: require('./SetWorkingQueueNode'),
  TransferToQueueNode: require('./TransferToQueueNode'),
  ...require('./StoreUserInputNode'),
};
