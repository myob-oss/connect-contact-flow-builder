const AbstractNode = require('../AbstractNode');

/**
 * @typedef PlayPromptOptions
 * @property {string|DynamicValue} [text]
 * @property {string} [textToSpeechType] - Defaults to {'text'}.
 * @property {string|DynamicValue} [audioPromptARN].
 * @property {string} [audioPromptName].
 * @property {AbstractNode} [successBranch]
 */

module.exports = class PlayPrompt extends AbstractNode {
  /**
   * @param {PlayPromptOptions} [options]
   */
  constructor(options = {}) {
    super('PlayPrompt');
    this.setSuccessBranch(options.successBranch || null);
    if (options.text) {
      this.setTextToSpeechType(this.__normalizeTextToSpeechType(options.textToSpeechType));
      this.setText(options.text);
    } else if (options.audioPromptARN) {
      this.setAudioPrompt(options.audioPromptARN, options.audioPromptName);
    }
  }

  __normalizeTextToSpeechType(type) {
    return (type || '').toLowerCase().trim() === 'ssml' ? 'ssml' : 'text';
  }

  setText(text) {
    this.metadata.useDynamic = typeof text !== 'string';
    return this.setParameter('Text', text);
  }

  setTextToSpeechType = textToSpeechType => this.setParameter('TextToSpeechType', textToSpeechType);

  setAudioPrompt = (value, resourceName = null) => {
    let audioPrompt;
    if (typeof value === 'string') {
      this.metadata.useDynamic = false;
      this.metadata.promptName = resourceName;
      audioPrompt = { value, resourceName };
    } else {
      this.metadata.useDynamic = true;
      audioPrompt = { ...value, resourceName };
    }
    return this.setParameter('AudioPrompt', audioPrompt);
  };

  /**
   * @param {AbstractNode} node
   * @returns {PlayPromptNode}
   */
  setSuccessBranch = node => this.setBranch('Success', node);
};
