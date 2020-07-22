const ContactFlowNode = require('./ContactFlowNode');

module.exports = class PlayPromptNode extends ContactFlowNode {
  /**
   * @param {string} [text]
   * @param {ContactFlowNode} [successBranch]
   */
  constructor(text, successBranch) {
    super('PlayPrompt');
    this.setSuccessBranch(successBranch || null);
    this.setTextToSpeechType('text');
    if (typeof text === 'string') {
      this.setText(text);
    }
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
}