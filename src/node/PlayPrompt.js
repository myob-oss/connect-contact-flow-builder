const ContactFlowNode = require('./ContactFlowNode');

/**
 * @typedef PlayPromptOptions
 * @property {string} [text]
 * @property {string} [textExternalAttribute]
 * @property {string} [textToSpeechType] - Defaults to {'text'}.
 * @property {ContactFlowNode} [successBranch]
 */

module.exports = class PlayPrompt extends ContactFlowNode {
  /**
   * @param {PlayPromptOptions} [options]
   */
  constructor(options = {}) {
    super('PlayPrompt');
    this.setSuccessBranch(options.successBranch || null);
    this.setTextToSpeechType(this.__normalizeTextToSpeechType(options.textToSpeechType));
    if (options.text) {
      this.setText(options.text);
    } else if (options.textExternalAttribute) {
      this.setTextExternalAttribute(options.textExternalAttribute);
    }
  }

  __normalizeTextToSpeechType(type) {
    return (type || '').toLowerCase().trim() === 'ssml' ? 'ssml' : 'text';
  }

  setText(text) {
    this.metadata.useDynamic = false;
    return this.setParameter('Text', text);
  }

  setTextExternalAttribute(attributeName) {
    this.metadata.useDynamic = true;
    return this.setParameter('Text', { value: attributeName, namespace: 'External' });
  }

  setTextToSpeechType = textToSpeechType => this.setParameter('TextToSpeechType', textToSpeechType);

  /**
   * @param {ContactFlowNode} node
   * @returns {PlayPromptNode}
   */
  setSuccessBranch = node => this.setBranch('Success', node);
};
