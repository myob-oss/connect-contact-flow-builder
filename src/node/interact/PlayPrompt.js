const AbstractNode = require('../AbstractNode');
const { isDynamicValue } = require('../dynamicValue');

/**
 * @typedef PlayPromptOptions
 * @property {string|DynamicValue} [promptText]
 * @property {string} [promptTextToSpeechType] - Defaults to {'text'}.
 * @property {string|DynamicValue} [promptAudioARN].
 * @property {string} [promptAudioName].
 * @property {AbstractNode} [successBranch]
 */

const normalizeTextToSpeechType = (type) => ((type || '').toLowerCase().trim() === 'ssml' ? 'ssml' : 'text');

module.exports = class PlayPrompt extends AbstractNode {
  /**
   * @param {PlayPromptOptions} [options]
   */
  constructor(options = {}) {
    super('PlayPrompt');
    this.metadata.useDynamic = false;
    this.setSuccessBranch(options.successBranch || null);
    if (options.promptText) {
      this.setPromptTextToSpeechType(normalizeTextToSpeechType(options.promptTextToSpeechType));
      this.setPromptText(options.promptText);
    } else if (options.promptAudioARN) {
      this.setPromptAudio(options.promptAudioARN, options.promptAudioName);
    }
  }

  /**
   * @param {string|DynamicValue} text
   * @returns {this}
   */
  setPromptText(text) {
    this.metadata.useDynamic = isDynamicValue(text);
    return this.setParameter('Text', text);
  }

  /**
   * @param {string} textToSpeechType
   * @returns {this}
   */
  setPromptTextToSpeechType(textToSpeechType) {
    return this.setParameter('TextToSpeechType', textToSpeechType);
  }

  /**
   * @param {string|DynamicValue} audioArn
   * @param {string} resourceName
   * @returns {this}
   */
  setPromptAudio(audioArn, resourceName = null) {
    let promptAudio;
    if (isDynamicValue(audioArn)) {
      this.metadata.useDynamic = true;
      promptAudio = { ...audioArn, resourceName };
    } else {
      this.metadata.useDynamic = false;
      this.metadata.promptName = resourceName;
      promptAudio = { value: audioArn, resourceName };
    }
    return this.setParameter('AudioPrompt', promptAudio);
  }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setSuccessBranch(node) {
    return this.setBranch('Success', node);
  }
};
