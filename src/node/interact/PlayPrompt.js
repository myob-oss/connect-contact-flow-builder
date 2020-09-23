const AbstractNode = require('../AbstractNode');
const { isDynamicValue } = require('../dynamicValue');

/**
 * @typedef PlayPromptOptions
 * @property {string|DynamicValue} [text]
 * @property {string} [textToSpeechType] - Defaults to {'text'}.
 * @property {string|DynamicValue} [audioPromptARN].
 * @property {string} [audioPromptName].
 * @property {AbstractNode} [successBranch]
 */

const normalizeTextToSpeechType = (type) => ((type || '').toLowerCase().trim() === 'ssml' ? 'ssml' : 'text');

module.exports = class PlayPrompt extends AbstractNode {
  /**
   * @param {PlayPromptOptions} [options]
   */
  constructor(options = {}) {
    super('PlayPrompt');
    this.setSuccessBranch(options.successBranch || null);
    if (options.text) {
      this.setTextToSpeechType(normalizeTextToSpeechType(options.textToSpeechType));
      this.setText(options.text);
    } else if (options.audioPromptARN) {
      this.setAudioPrompt(options.audioPromptARN, options.audioPromptName);
    }
  }

  setText(text) {
    this.metadata.useDynamic = isDynamicValue(text);
    return this.setParameter('Text', text);
  }

  setTextToSpeechType(textToSpeechType) {
    return this.setParameter('TextToSpeechType', textToSpeechType);
  }

  setAudioPrompt(value, resourceName = null) {
    let audioPrompt;
    if (isDynamicValue(value)) {
      this.metadata.useDynamic = true;
      audioPrompt = { ...value, resourceName };
    } else {
      this.metadata.useDynamic = false;
      this.metadata.promptName = resourceName;
      audioPrompt = { value, resourceName };
    }
    return this.setParameter('AudioPrompt', audioPrompt);
  }

  /**
   * @param {AbstractNode} node
   * @returns {PlayPrompt}
   */
  setSuccessBranch(node) {
    return this.setBranch('Success', node);
  }
};
