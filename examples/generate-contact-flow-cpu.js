const fs = require('fs');
const path = require('path');

const { buildContactFlow } = require('../src');
const {
  PlayPromptNode,
  InvokeExternalResourceNode,
  SetAttributesNode,
  DisconnectNode,
  CheckExternalAttributeNode,
  StoreUserInputCreditCardNode,
  StoreUserInputCustomNode,
  StoreUserInputLocalPhoneAuNode,
  SetWorkingQueueNode,
  TransferToQueueNode,
} = require('../src/node');

const cwd = process.cwd();
if (process.argv.length < 3) {
  const invocation = `node .${process.argv[1].slice(cwd.length)}`;
  console.log('Invalid invocation');
  console.log('');
  console.log(`Usage: ${invocation} LAMBDA_ARN [OUTPUT_PATH]`);
  console.log('Generate the Contact Flow CPU for LAMBDA_ARN and write it to stdout');
  console.log('or OUTPUT_PATH if specified.');
  process.exit(1);
}

const lambdaArn = process.argv[2];
const output = JSON.stringify(generateContactFlowCpu(lambdaArn));
if (process.argv[3]) {
  console.log('Write file to', process.argv[3]);
  fs.writeFileSync(path.resolve(process.argv[3]), output);
  process.exit(0);
} else {
  console.log(output);
  process.exit(0);
}

/// --------------------------------------------------------------------------------------------------------------------

function errorHandler(handlerNode, panicNode) {
  return (errorType) => new SetAttributesNode()
    .setTextAttribute('Error', errorType)
    .setSuccessBranch(handlerNode)
    .setErrorBranch(panicNode);
}

function userInputNodeProcessor(mainNode, handleError) {
  return (storeUserInputNode) => storeUserInputNode && storeUserInputNode
    .setSuccessBranch(
      new SetAttributesNode()
        .setDynamicSystemAttribute('$.External.StoreCustomerInputDestinationKey', 'Stored customer input')
        .setSuccessBranch(mainNode)
        .setErrorBranch(handleError('SetContactAttributesError'))
    )
    .setErrorBranch(handleError('StoreCustomerInputError'));
}

function generateContactFlowCpu(lambdaArn) {
  const mainNode = new InvokeExternalResourceNode(lambdaArn, 8);
  const exitUnrecoverableNode = new PlayPromptNode('There was an unrecoverable error', new DisconnectNode());
  mainNode.setErrorBranch(exitUnrecoverableNode);

  const handleError = errorHandler(mainNode, exitUnrecoverableNode);
  const processUserInputNode = userInputNodeProcessor(mainNode, handleError);

  const commandRouterNode =
    new CheckExternalAttributeNode('Command')
      .setEqualsBranch(
        'PlayPrompt',
        new PlayPromptNode()
          .setTextToSpeechType('ssml')
          .setTextExternalAttribute('PlayPromptText')
          .setSuccessBranch(mainNode)
      )
      .setEqualsBranch(
        'SetContactAttribute',
        new SetAttributesNode()
          .setDynamicExternalAttribute('$.External.AttributeKey', 'AttributeValue')
          .setSuccessBranch(mainNode)
          .setErrorBranch(handleError('SetContactAttributesError'))
      )
      .setEqualsBranch(
        'StoreCustomerInput',
        processUserInputNode(new StoreUserInputCreditCardNode().setTextToSpeechType('ssml'))
      )
      .setEqualsBranch(
        'StoreCustomerInputUnencrypted',
        processUserInputNode(new StoreUserInputCustomNode().setTextToSpeechType('ssml'))
      )
      .setEqualsBranch(
        'StoreCustomerInputLocalPhoneNumber',
        processUserInputNode(
          new StoreUserInputLocalPhoneAuNode()
            .setTextToSpeechType('ssml')
            .setInvalidNumberBranch(handleError('StoreCustomerInputInvalidNumber'))
        )
      )
      .setEqualsBranch(
        'TransferToQueue',
        new SetWorkingQueueNode()
          .setQueueArnExternalAttribute('QueueArn')
          .setSuccessBranch(
            new PlayPromptNode()
              .setTextToSpeechType('ssml')
              .setTextExternalAttribute('PreTransferPromptText')
              .setSuccessBranch(
                new TransferToQueueNode()
                  .setAtCapacityBranch(handleError('TransferToQueueAtCapacity'))
                  .setErrorBranch(handleError('TransferToQueueError'))
              )
          )
          .setErrorBranch(handleError('SetWorkingQueueError'))
      )
      .setEqualsBranch(
        'CompleteCall',
        new PlayPromptNode()
          .setTextToSpeechType('ssml')
          .setTextExternalAttribute('CompleteCallText')
          .setSuccessBranch(new DisconnectNode())
      )
      .setNoMatchBranch(new PlayPromptNode('Unrecognized command', exitUnrecoverableNode));

  const setBaseAttributesNode = new SetAttributesNode()
    .setDynamicExternalAttribute('SuccessHandler', 'SuccessHandler')
    .setDynamicExternalAttribute('ErrorHandler', 'ErrorHandler')
    .setDynamicExternalAttribute('Program', 'Program')
    .setDynamicExternalAttribute('Error', 'Error')
    .setSuccessBranch(commandRouterNode)
    .setErrorBranch(exitUnrecoverableNode);
  mainNode.setSuccessBranch(setBaseAttributesNode);

  return buildContactFlow(mainNode);
};
