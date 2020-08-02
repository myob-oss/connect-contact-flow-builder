const ContactFlowNode = require('./ContactFlowNode');

/**
 * @typedef GetCustomerInputOptions
 * @property {string} [text]
 * @property {string} [textExternalAttribute].
 * @property {string} [textToSpeechType] - Defaults to {'text'}.
 * @property {number} [timeout] - Defaults to {5}.
 * @property {ContactFlowNode} [timeoutBranch] -
 * @property {ContactFlowNode} [noMatchBranch] -
 * @property {ContactFlowNode} [errorBranch] -
 */

module.exports = class GetCustomerInput extends ContactFlowNode {
  /**
   * @param {GetCustomerInputOptions} [options]
   */
  constructor(options = {}) {
    super('GetUserInput');
    this.target = 'Digits';
    this.metadata.conditionMetadata = [];
    if (options.text) {
      this.setText(options.text);
    } else if (options.textExternalAttribute) {
      this.setTextExternalAttribute(options.textExternalAttribute);
    }
    this.setTextToSpeechType(options.textToSpeechType);
    this.setTimeout(options.timeout || 5);
    this.setParameter('MaxDigits', '1');
    this.setTimeoutBranch(options.timeoutBranch || null);
    this.setNoMatchBranch(options.noMatchBranch || null);
    this.setErrorBranch(options.errorBranch || null);
  }

  setText(text) {
    this.metadata.useDynamic = false;
    return this.setParameter('Text', text);
  }

  setTextExternalAttribute(attributeName) {
    this.metadata.useDynamic = true;
    return this.setParameter('Text', { value: attributeName, namespace: 'External' });
  }

  setTextToSpeechType = textToSpeechType => this.setParameter(
    'TextToSpeechType',
    (textToSpeechType || '').toLowerCase().trim() === 'ssml' ? 'ssml' : 'text',
  );

  setTimeout(timeout) {
    return this.setParameter('Timeout', timeout.toString());
  }

  setTimeoutBranch = node => this.setBranch('Timeout', node);

  setNoMatchBranch = node => this.setBranch('NoMatch', node);

  setErrorBranch = node => this.setBranch('Error', node);

  /**
   * @param {string|number} matchValue
   * @param {ContactFlowNode} node
   * @returns {GetCustomerInput}
   */
  addEqualsBranch = (matchValue, node) => {
    this.metadata.conditionMetadata.push({ value: matchValue.toString() });
    return this.addBranch({
      condition: 'Evaluate',
      conditionType: 'Equals',
      conditionValue: matchValue.toString(),
    }, node);
  };
};
