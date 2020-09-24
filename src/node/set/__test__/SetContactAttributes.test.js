const { getBranch, getParameters } = require('../../testutil');
const dynamicValue = require('../../dynamicValue');
const SetContactAttributes = require('../SetContactAttributes');

describe('SetContactAttributes', () => {
  it('sets the success and error branches', () => {
    const mockSuccessTarget = { id: 'success-id' };
    const mockErrorTarget = { id: 'error-id' };
    const result = new SetContactAttributes({
      successBranch: mockSuccessTarget,
      errorBranch: mockErrorTarget,
    }).build();

    expect(result.type).toEqual('SetAttributes');
    expect(getBranch(result, 'Success')).toEqual({
      condition: 'Success',
      transition: 'success-id',
    });
    expect(getBranch(result, 'Error')).toEqual({
      condition: 'Error',
      transition: 'error-id',
    });
  });

  it('sets static attributes', () => {
    const result = new SetContactAttributes({
      attributes: [
        { destinationKey: 'AlphaKey', value: 'alpha value' },
        { destinationKey: 'BravoKey', value: 'bravo value' },
      ],
    })
      .build();

    const attributes = getParameters(result, 'Attribute');
    expect(attributes).toHaveLength(2);
    expect(attributes.find(({ key }) => key === 'AlphaKey')).toEqual({
      name: 'Attribute',
      key: 'AlphaKey',
      value: 'alpha value',
    });
    expect(attributes.find(({ key }) => key === 'BravoKey')).toEqual({
      name: 'Attribute',
      key: 'BravoKey',
      value: 'bravo value',
    });
  });

  it('sets dynamic attributes', () => {
    const result = new SetContactAttributes({
      attributes: [
        {
          destinationKey: 'ExternalKey',
          value: dynamicValue.External('$.Attributes.AlphaKey'),
        },
        {
          destinationKey: 'QueueARN',
          value: dynamicValue.System.QueueARN,
        },
      ],
    })
      .build();

    const attributes = getParameters(result, 'Attribute');
    expect(attributes).toHaveLength(2);
    expect(attributes.find(({ key }) => key === 'ExternalKey')).toEqual({
      name: 'Attribute',
      key: 'ExternalKey',
      value: '$.Attributes.AlphaKey',
      namespace: 'External',
    });
    expect(attributes.find(({ key }) => key === 'QueueARN')).toEqual({
      name: 'Attribute',
      key: 'QueueARN',
      value: 'Queue.ARN',
      namespace: 'System',
    });
  });
});
