const { getBranch, getParameter, getParameters } = require('../../testutil');
const dynamicValue = require('../../dynamicValue');
const InvokeAWSLambdaFunction = require('../InvokeAWSLambdaFunction');

describe('InvokeAWSLambdaFunction', () => {
  describe('basics', () => {
    let result;

    beforeAll(() => {
      const mockSuccessTarget = { id: 'success-id' };
      const mockErrorTarget = { id: 'error-id' };
      result = new InvokeAWSLambdaFunction({
        successBranch: mockSuccessTarget,
        errorBranch: mockErrorTarget,
      }).build();
    });

    it('sets the type and target', () => {
      expect(result.type).toEqual('InvokeExternalResource');
      expect(result.target).toEqual('Lambda');
    });

    it('sets the default time limit', () => {
      expect(getParameter(result, 'TimeLimit')).toEqual({
        name: 'TimeLimit',
        value: '3',
      });
    });

    it('sets the success and error branches', () => {
      expect(getBranch(result, 'Success')).toEqual({
        condition: 'Success',
        transition: 'success-id',
      });
      expect(getBranch(result, 'Error')).toEqual({
        condition: 'Error',
        transition: 'error-id',
      });
    });
  });

  it('builds a static lambda node', () => {
    const result = new InvokeAWSLambdaFunction({
      functionArn: 'arn:test',
      timeLimit: 8,
    }).build();

    expect(result.metadata.useDynamic).toEqual(false);
    expect(getParameter(result, 'TimeLimit')).toEqual({
      name: 'TimeLimit',
      value: '8',
    });
    expect(getParameter(result, 'FunctionArn')).toEqual({
      name: 'FunctionArn',
      value: 'arn:test',
    });
  });

  it('builds a dynamic lambda node', () => {
    const result = new InvokeAWSLambdaFunction({
      functionArn: dynamicValue.External('$.Attributes.newArn'),
      timeLimit: 8,
    }).build();

    expect(result.metadata.useDynamic).toEqual(true);
    expect(getParameter(result, 'TimeLimit')).toEqual({
      name: 'TimeLimit',
      value: '8',
    });
    expect(getParameter(result, 'FunctionArn')).toEqual({
      name: 'FunctionArn',
      value: '$.Attributes.newArn',
      namespace: 'External',
    });
  });

  it('passes function input parameters', () => {
    const result = new InvokeAWSLambdaFunction({
      inputParameters: [
        { destinationKey: 'SimpleInput', value: 'simple value' },
        { destinationKey: 'DynamicInput', value: dynamicValue.External('$.Foo.bar') },
      ],
    }).build();

    const parameters = getParameters(result, 'Parameter');
    expect(parameters.length).toEqual(2);
    expect(parameters.find(({ key }) => key === 'SimpleInput')).toEqual({
      name: 'Parameter',
      key: 'SimpleInput',
      value: 'simple value',
    });
    expect(parameters.find(({ key }) => key === 'DynamicInput')).toEqual({
      name: 'Parameter',
      key: 'DynamicInput',
      value: '$.Foo.bar',
      namespace: 'External',
    });
    expect(result.metadata.dynamicMetadata).toEqual({
      SimpleInput: false,
      DynamicInput: true,
    });
  });
});
