const ContactFlowNode = require('./ContactFlowNode');

/**
 * @typedef AbstractStoreUserInputNodeOptions
 * @property {ContactFlowNode} [successBranch]
 * @property {ContactFlowNode} [errorBranch]
 * @property {string} [textToSpeechType]
 * @property {string} [textExternalAttribute]
 * @property {string} [text]
 * @property {number} [maxDigits]
 * @property {number} [timeout] - The timeout before first entry in seconds.
 */

class __AbstractStoreUserInputNode extends ContactFlowNode {
  /**
   * @param {AbstractStoreUserInputNodeOptions} [options]
   */
  constructor(options = {}) {
    super('StoreUserInput');
    this.metadata.useDynamic = false;
    this.metadata.useDynamicForEncryptionKeys = true;
    this.metadata.useDynamicForTerminatorDigits = false;

    this.setSuccessBranch(options.successBranch || null);
    this.setErrorBranch(options.errorBranch || null);
    this.setTimeout(options.timeout || 5);
    this.setMaxDigits(options.maxDigits || 20);
    this.setTextToSpeechType(this.__normalizeTextToSpeechType(options.textToSpeechType));
    if (options.text) {
      this.metadata.useDynamic = false;
      this.setParameter('Text', options.text);
    } else if (options.textExternalAttribute) {
      this.metadata.useDynamic = true;
      this.setParameter('Text', { value: options.textExternalAttribute, namespace: 'External' });
    }
  }

  __normalizeTextToSpeechType(type) {
    return (type || '').toLowerCase().trim() === 'ssml' ? 'ssml' : 'text';
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {SetAttributes}
   */
  setSuccessBranch = node => this.setBranch('Success', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {SetAttributes}
   */
  setErrorBranch = node => this.setBranch('Error', node);

  /**
   * @param {string} textToSpeechType
   * @returns {ContactFlowNode}
   */
  setTextToSpeechType = textToSpeechType => this.setParameter('TextToSpeechType', textToSpeechType);

  /**
   * @param {number} maxDigits
   * @returns {ContactFlowNode}
   */
  setMaxDigits = maxDigits => this.setParameter('MaxDigits', maxDigits);

  /**
   * @param {number} timeout
   * @returns {ContactFlowNode}
   */
  setTimeout = timeout => this.setParameter('Timeout', timeout.toString());
}

/**
 * @typedef {AbstractStoreUserInputNodeOptions} StoreUserInputCustomOptions
 * @property {boolean} [encryptEntry] - Defaults to {false}
 * @property {string} [encryptionKeyIdExternalAttribute]
 * @property {string} [encryptionKeyExternalAttribute]
 */

class StoreUserInputCustom extends __AbstractStoreUserInputNode {
  /**
   * @param {StoreUserInputCustomOptions} [options]
   */
  constructor(options= {}) {
    super(options);
    this.setParameter('CustomerInputType', 'Custom');
    this.setParameter('DisableCancel', 'false');
    if (options.encryptEntry) {
      this.setParameter('EncryptEntry', true);
      this.setParameter('EncryptionKeyId', {
        value: options.encryptionKeyIdExternalAttribute,
        namespace: 'External',
      });
      this.setParameter('EncryptionKey', {
        value: options.encryptionKeyExternalAttribute,
        namespace: 'External',
      });
    } else {
      this.setParameter('EncryptEntry', false);
    }
  }
}

/**
 * @typedef {AbstractStoreUserInputNodeOptions} StoreUserInputPhone
 * @property {string} countryCode - Two-letter country code (e.g. {'AU'} for Australia).
 * @property {string} [phoneNumberFormat] - Default to {'local'}.
 * @property {ContactFlowNode} [invalidNumberBranch]
 */

class StoreUserInputPhone extends __AbstractStoreUserInputNode {
  /**
   * @param {StoreUserInputPhone} options
   */
  constructor(options) {
    super(options);
    this.setInvalidNumberBranch(options.invalidNumberBranch || null);
    this.setCountryCode(options.countryCode);
    this.setParameter('CustomerInputType', 'PhoneNumber');
    this.setParameter('PhoneNumberFormat', this.__normalizePhoneNumberFormat(options.phoneNumberFormat));
  }

  __normalizePhoneNumberFormat(phoneNumberFormat) {
    // TODO
    return 'Local';
  }

  setInvalidNumberBranch = node => this.setBranch('InvalidNumber', node);

  setCountryCode(countryCode) {
    const normalCountryCode = (countryCode || '').toUpperCase().trim();
    // TODO
    this.metadata.countryCodePrefix = '+61';
    return this.setParameter('CountryCode', normalCountryCode);
  }
}

module.exports = {
  StoreUserInputCustom,
  StoreUserInputPhone,
};
