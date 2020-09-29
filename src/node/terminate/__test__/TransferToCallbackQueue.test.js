const { getBranch, getParameter } = require('../../testutil');
const TransferToCallbackQueue = require('../TransferToCallbackQueue');

describe('TransferToCallbackQueue', () => {
  it('builds the basics', () => {
    const result = new TransferToCallbackQueue().build();
    expect(result.type).toEqual('CreateCallback');
    expect(result.metadata.useDynamic).toEqual(false);
    expect(getParameter(result, 'InitialDelaySeconds')).toEqual({
      name: 'InitialDelaySeconds',
      value: 99,
    });
    expect(getParameter(result, 'RetryDelaySeconds')).toEqual({
      name: 'RetryDelaySeconds',
      value: 600,
    });
    expect(getParameter(result, 'MaxRetryAttempts')).toEqual({
      name: 'MaxRetryAttempts',
      value: 1,
    });
    expect(getParameter(result, 'Queue')).toBeUndefined();
    expect(getParameter(result, 'Agent')).toBeUndefined();
  });

  it('sets the "Success" branch', () => {
    const result = new TransferToCallbackQueue({
      successBranch: { id: 'success-id' },
    }).build();

    expect(getBranch(result, 'Success')).toEqual({
      condition: 'Success',
      transition: 'success-id',
    });
  });

  it('sets the "Error" branch', () => {
    const result = new TransferToCallbackQueue({
      errorBranch: { id: 'error-id' },
    }).build();

    expect(getBranch(result, 'Error')).toEqual({
      condition: 'Error',
      transition: 'error-id',
    });
  });

  it('sets the initial delay', () => {
    const result = new TransferToCallbackQueue({
      initialDelay: 88,
    }).build();

    expect(getParameter(result, 'InitialDelaySeconds')).toEqual({
      name: 'InitialDelaySeconds',
      value: 88,
    });
  });

  it('sets the minimum time between attempts', () => {
    const result = new TransferToCallbackQueue({
      minTimeBetweenAttempts: 888,
    }).build();

    expect(getParameter(result, 'RetryDelaySeconds')).toEqual({
      name: 'RetryDelaySeconds',
      value: 888,
    });
  });

  it('sets the maximum number of retries', () => {
    const result = new TransferToCallbackQueue({
      maxNumberOfRetries: 0,
    }).build();

    expect(getParameter(result, 'MaxRetryAttempts')).toEqual({
      name: 'MaxRetryAttempts',
      value: 0,
    });
  });

  it('sets a working queue', () => {
    const result = new TransferToCallbackQueue({
      displayName: 'FooQueue',
      queueArn: 'aws:arn:foo',
    }).build();

    expect(result.metadata.useDynamic).toEqual(false);
    expect(result.metadata.queue).toEqual({
      id: 'aws:arn:foo',
      text: 'FooQueue',
    });
    expect(getParameter(result, 'Queue')).toEqual({
      name: 'Queue',
      value: 'aws:arn:foo',
      resourceName: 'FooQueue',
    });
  });
});
