const ContactFlowNode = require('./ContactFlowNode');

class __AbstractStoreUserInputNode extends ContactFlowNode {
  constructor() {
    super('StoreUserInput');
    this.setSuccessBranch(null);
    this.setErrorBranch(null);
    this.setParameter('Text', { value: 'StoreCustomerInputPromptText', namespace: 'External' });
    this.setParameter('TextToSpeechType', 'text');
    this.setParameter('Timeout', '5');
  }

  /**
   * @param {ContactFlowNode} node
   * @returns {SetAttributesNode}
   */
  setSuccessBranch = node => this.setBranch('Success', node);

  /**
   * @param {ContactFlowNode} node
   * @returns {SetAttributesNode}
   */
  setErrorBranch = node => this.setBranch('Error', node);

  setTextToSpeechType = textToSpeechType => this.setParameter('TextToSpeechType', textToSpeechType);

  /**
   * @param {number} maxDigits
   * @returns {ContactFlowNode}
   */
  setMaxDigits = maxDigits => this.setParameter('MaxDigits', maxDigits);

  build() {
    const built = super.build();
    return {
      ...built,
      metadata: {
        ...built.metadata,
        useDynamic: true,
        useDynamicForEncryptionKeys: true,
        useDynamicForTerminatorDigits: false,
      },
    };
  }
}

class StoreUserInputCustomNode extends __AbstractStoreUserInputNode {
  constructor() {
    super();
    this.setMaxDigits(20);
    this.setParameter('CustomerInputType', 'Custom');
    this.setParameter('DisableCancel', 'false');
    this.setParameter('EncryptEntry', false);
  }

  /**
   * @param {boolean} encrypt
   */
  enableEncryption(encrypt) {
    if (encrypt) {
      return this
        .setParameter('EncryptEntry', true)
        .setParameter('EncryptionKeyId', { value: 'EncryptionKeyID', namespace: 'External' })
        .setParameter('EncryptionKey', { value: 'EncryptionCertificate', namespace: 'External' });
    }
    return this.setParameter('EncryptEntry', false);
  }
}

class StoreUserInputCreditCardNode extends StoreUserInputCustomNode {
  constructor() {
    super();
    this.setMaxDigits(16);
    this.enableEncryption(true);
  }
}

class StoreUserInputLocalPhoneAuNode extends __AbstractStoreUserInputNode {
  constructor() {
    super();
    this.setInvalidNumberBranch(null);
    this.setParameter('CustomerInputType', 'PhoneNumber');
    this.setParameter('PhoneNumberFormat', 'Local');
    this.setParameter('CountryCode', 'AU');
  }

  setInvalidNumberBranch = node => this.setBranch('InvalidNumber', node);

  build() {
    const built = super.build();
    return {
      ...built,
      metadata: {
        ...built.metadata,
        countryCodePrefix: '+61',
      },
    }
  }
}

module.exports = {
  StoreUserInputCustomNode,
  StoreUserInputCreditCardNode,
  StoreUserInputLocalPhoneAuNode,
};
