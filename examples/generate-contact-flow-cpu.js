const PlayPrompt = require('../src/node/interact/PlayPrompt');
const Disconnect = require('../src/node/terminate/Disconnect');
const SetAttributes = require('../src/node/set/SetAttributes');
const InvokeExternalResource = require('../src/node/integrate/InvokeExternalResource');
const CheckExternalAttribute = require('../src/node/branch/CheckExternalAttribute');
const { StoreUserInputCustom, StoreUserInputPhone } = require('../src/node/interact/StoreUserInput');
const SetWorkingQueue = require('../src/node/set/SetWorkingQueue');
const TransferToQueue = require('../src/node/terminate/TransferToQueue');
const GetCustomerInput = require('../src/node/interact/GetCustomerInput');

/**
 * @param {string} functionArn - The ARN of the CPU Lambda which runs the IVR programs.
 * @returns {ContactFlowNode}
 */
module.exports = function generateContactFlowCpu(functionArn) {
  const mainNode = new InvokeExternalResource({ functionArn, timeLimit: 8 });
  const exitUnrecoverableNode = new PlayPrompt({
    text: 'There was an unrecoverable error',
    successBranch: new Disconnect(),
  });
  mainNode.setErrorBranch(exitUnrecoverableNode);

  function handleError(errorType) {
    return new SetAttributes({
      successBranch: mainNode,
      errorBranch: exitUnrecoverableNode,
    })
      .addTextAttribute('Error', errorType);
  }

  function processUserInputNode(storeUserInputNode) {
    return storeUserInputNode && storeUserInputNode
      .setSuccessBranch(
        new SetAttributes({
          successBranch: mainNode,
          errorBranch: handleError('SetContactAttributesError'),
        })
          .addDynamicSystemAttribute('$.External.StoreCustomerInputDestinationKey', 'Stored customer input')
      )
      .setErrorBranch(handleError('StoreCustomerInputError'));
  }

  const commandRouterNode =
    new CheckExternalAttribute({ externalAttributeName: 'Command' })
      .addEqualsBranch(
        'PlayPrompt',
        new PlayPrompt({
          textExternalAttribute: 'PlayPromptText',
          textToSpeechType: 'ssml',
          successBranch: mainNode,
        }),
      )
      .addEqualsBranch(
        'SetContactAttribute',
        new SetAttributes({
          successBranch: mainNode,
          errorBranch: handleError('SetContactAttributesError'),
        })
          .addDynamicExternalAttribute('$.External.AttributeKey', 'AttributeValue')
      )
      .addEqualsBranch(
        'StoreCustomerInput',
        processUserInputNode(new StoreUserInputCustom({
          textExternalAttribute: 'StoreCustomerInputPromptText',
          textToSpeechType: 'ssml',
          maxDigits: 16,
          encryptEntry: true,
          encryptionKeyIdExternalAttribute: 'EncryptionKeyID',
          encryptionKeyExternalAttribute: 'EncryptionCertificate',
        }))
      )
      .addEqualsBranch(
        'StoreCustomerInputUnencrypted',
        processUserInputNode(new StoreUserInputCustom({
          textExternalAttribute: 'StoreCustomerInputPromptText',
          textToSpeechType: 'ssml',
        }))
      )
      .addEqualsBranch(
        'StoreCustomerInputLocalPhoneNumber',
        processUserInputNode(
          new StoreUserInputPhone({
            textExternalAttribute: 'StoreCustomerInputPromptText',
            textToSpeechType: 'ssml',
            countryCode: 'AU',
            invalidNumberBranch: handleError('StoreCustomerInputInvalidNumber')
          })
        )
      )
      .addEqualsBranch(
        'TransferToQueue',
        new SetWorkingQueue({
          queueArnExternalAttribute: 'QueueArn',
          errorBranch: handleError('SetWorkingQueueError'),
          successBranch: new PlayPrompt({
            textToSpeechType: 'ssml',
            textExternalAttribute: 'PreTransferPromptText',
            successBranch: new TransferToQueue({
              atCapacityBranch: handleError('TransferToQueueAtCapacity'),
              errorBranch: handleError('TransferToQueueError'),
            })
          })
        })
      )
      .addEqualsBranch(
        'GetCustomerInputDigit',
        new GetCustomerInput({
          textToSpeechType: 'ssml',
          textExternalAttribute: 'PromptText',
          errorBranch: handleError('GetCustomerInputError'),
          // TODO
          noMatchBranch: exitUnrecoverableNode,
          timeoutBranch: exitUnrecoverableNode,
        })
          .addEqualsBranch(
            1,
            new SetAttributes({
              successBranch: mainNode,
              errorBranch: handleError('SetContactAttributesError'),
            }).addTextAttribute('$.External.GetCustomerInputDestinationKey', '1')
          )
          .addEqualsBranch(
            2,
            new SetAttributes({
              successBranch: mainNode,
              errorBranch: handleError('SetContactAttributesError'),
            }).addTextAttribute('$.External.GetCustomerInputDestinationKey', '2')
          )
      )
      .addEqualsBranch(
        'CompleteCall',
        new PlayPrompt({
          textToSpeechType: 'ssml',
          textExternalAttribute: 'CompleteCallText',
          successBranch: new Disconnect(),
        })
      )
      .setNoMatchBranch(new PlayPrompt({
        text: 'Unrecognized command',
        successBranch: exitUnrecoverableNode,
      }));

  const setBaseAttributesNode = new SetAttributes({
    successBranch: commandRouterNode,
    errorBranch: exitUnrecoverableNode,
  })
    .addDynamicExternalAttribute('SuccessHandler', 'SuccessHandler')
    .addDynamicExternalAttribute('ErrorHandler', 'ErrorHandler')
    .addDynamicExternalAttribute('Program', 'Program')
    .addDynamicExternalAttribute('Error', 'Error');
  mainNode.setSuccessBranch(setBaseAttributesNode);

  return mainNode;
};
