const { getParameter } = require('../../testutil');
const dynamicValue = require('../../dynamicValue');
const StoreCustomerInputCustom = require('../StoreCustomerInputCustom');

describe('StoreCustomerInputCustom', () => {
  it('builds the basics', () => {
    const result = new StoreCustomerInputCustom().build();
    expect(result.type).toBe('StoreUserInput');
    expect(result.metadata.useDynamic).toBe(false);
    expect(result.metadata.useDynamicForEncryptionKeys).toBe(false);
    expect(result.metadata.useDynamicForTerminatorDigits).toBe(false);
    expect(getParameter(result, 'CustomerInputType')).toEqual({
      name: 'CustomerInputType',
      value: 'Custom',
    });
    expect(getParameter(result, 'Timeout')).toEqual({
      name: 'Timeout',
      value: '5',
    });
    expect(getParameter(result, 'MaxDigits')).toEqual({
      name: 'MaxDigits',
      value: 20,
    });
    expect(getParameter(result, 'EncryptEntry')).toEqual({
      name: 'EncryptEntry',
      value: false,
    });
    expect(getParameter(result, 'DisableCancel')).toEqual({
      name: 'DisableCancel',
      value: false,
    });
  });

  it('configures the max digits', () => {
    const result = new StoreCustomerInputCustom({ maximumDigits: 16 }).build();
    expect(getParameter(result, 'MaxDigits')).toEqual({
      name: 'MaxDigits',
      value: 16,
    });
  });

  it('disables the cancel key', () => {
    const result = new StoreCustomerInputCustom({ disableCancelKey: true }).build();
    expect(getParameter(result, 'DisableCancel')).toEqual({
      name: 'DisableCancel',
      value: true,
    });
  });

  describe('encryption', () => {
    it('encrypts using a static key', () => {
      const result = new StoreCustomerInputCustom({
        encryptionKeyId: 'encryption-key-id',
        encryptionKey: 'encryption-key',
      }).build();
      expect(result.metadata.useDynamicForEncryptionKeys).toBe(false);
      expect(getParameter(result, 'EncryptEntry')).toEqual({
        name: 'EncryptEntry',
        value: true,
      });
      expect(getParameter(result, 'EncryptionKeyId')).toEqual({
        name: 'EncryptionKeyId',
        value: 'encryption-key-id',
      });
      expect(getParameter(result, 'EncryptionKey')).toEqual({
        name: 'EncryptionKey',
        value: 'encryption-key',
      });
    });

    it('encrypts using a dynamic key', () => {
      const result = new StoreCustomerInputCustom({
        encryptionKeyId: dynamicValue.System.CustomerNumber,
        encryptionKey: dynamicValue.External('$.Attributes.foo'),
      }).build();
      expect(result.metadata.useDynamicForEncryptionKeys).toBe(true);
      expect(getParameter(result, 'EncryptEntry')).toEqual({
        name: 'EncryptEntry',
        value: true,
      });
      expect(getParameter(result, 'EncryptionKeyId')).toEqual({
        name: 'EncryptionKeyId',
        value: 'Customer Number',
        namespace: 'System',
      });
      expect(getParameter(result, 'EncryptionKey')).toEqual({
        name: 'EncryptionKey',
        value: '$.Attributes.foo',
        namespace: 'External',
      });
    });

    it('throws an error when encryption key details are mixed values', () => {
      expect(() => new StoreCustomerInputCustom({
        encryptionKeyId: dynamicValue.System.CustomerNumber,
        encryptionKey: 'basicString',
      })).toThrowError('Validation error: encryptionKeyId and encryptionKey must both be '
        + 'strings or both be DynamicValues');
    });
  });

  describe('terminating keypress', () => {
    it('specifies a static encryption key', () => {
      const result = new StoreCustomerInputCustom({
        terminatingKeypress: '12#4*',
      }).build();
      expect(result.metadata.useDynamicForTerminatorDigits).toBe(false);
      expect(getParameter(result, 'TerminatorDigits')).toEqual({
        name: 'TerminatorDigits',
        value: '12#4*',
      });
    });

    it('throws an error for invalid static terminating keypress length', () => {
      expect(() => new StoreCustomerInputCustom({ terminatingKeypress: '123456' }))
        .toThrowError('Validation error: terminatingKeypress is longer than 5 characters');
    });

    it('throws an error for invalid static terminating keypress character', () => {
      expect(() => new StoreCustomerInputCustom({ terminatingKeypress: '01#*x' }))
        .toThrowError('Validation error: terminatingKeypress may only contain 0-9, # or *');
    });

    it('specifies a dynamic encryption key', () => {
      const result = new StoreCustomerInputCustom({
        terminatingKeypress: dynamicValue.System.StoredCustomerInput,
      }).build();
      expect(result.metadata.useDynamicForTerminatorDigits).toBe(true);
      expect(getParameter(result, 'TerminatorDigits')).toEqual({
        name: 'TerminatorDigits',
        value: 'Stored customer input',
        namespace: 'System',
      });
    });
  });
});
