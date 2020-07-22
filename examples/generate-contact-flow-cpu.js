const fs = require('fs');
const path = require('path');

const { buildContactFlow } = require('../src');
const PlayPrompt = require('../src/node/PlayPrompt');
const Disconnect = require('../src/node/Disconnect');
const SetAttributes = require('../src/node/SetAttributes');
const InvokeExternalResource = require('../src/node/InvokeExternalResource');
const CheckExternalAttribute = require('../src/node/CheckExternalAttribute');
const { StoreUserInputCustom, StoreUserInputPhone } = require('../src/node/StoreUserInput');
const SetWorkingQueue = require('../src/node/SetWorkingQueue');
const TransferToQueue = require('../src/node/TransferToQueue');

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

/**
 * @param {string} functionArn - The ARN of the CPU Lambda which runs the IVR programs.
 * @returns {*}
 */
function generateContactFlowCpu(functionArn) {
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

  return buildContactFlow(mainNode);
}
