const { getBranch, getParameter } = require('../../testutil');
const dynamicValue = require('../../dynamicValue');
const SetWorkingQueue = require('../SetWorkingQueue');

describe('SetWorkingQueue', () => {
  it('builds the basics', () => {
    const result = new SetWorkingQueue().build();
    expect(result.metadata.useDynamic).toEqual(false);
    expect(getBranch(result, 'Success')).toEqual({
      condition: 'Success',
      transition: null,
    });
    expect(getBranch(result, 'Error')).toEqual({
      condition: 'Error',
      transition: null,
    });
  });

  it('sets a static queue', () => {
    const result = new SetWorkingQueue({
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

  it('sets a queue by attribute', () => {
    const result = new SetWorkingQueue({
      queueArn: dynamicValue.System.DialedNumber,
    }).build();

    expect(result.metadata.useDynamic).toEqual(true);
    expect(result.metadata.queue).toEqual('Dialed Number');
    expect(getParameter(result, 'Queue')).toEqual({
      name: 'Queue',
      value: 'Dialed Number',
      namespace: 'System',
    });
  });

  it('sets a static agent', () => {
    const result = new SetWorkingQueue({
      displayName: 'alovelace (Ada Lovelace)',
      agentArn: 'arn:aws:connect:ap-southeast-2:000000000000:instance/'
        + '54cb5f11-cbde-4029-8d4b-a8e2e3591f02/agent/08cc85d2-8f7f-4107-b465-c2681f64c48d',
    }).build();

    expect(result.metadata.useDynamic).toEqual(false);
    expect(result.metadata.queue).toEqual({
      id: 'arn:aws:connect:ap-southeast-2:000000000000:instance/'
        + '54cb5f11-cbde-4029-8d4b-a8e2e3591f02/agent/08cc85d2-8f7f-4107-b465-c2681f64c48d',
      text: 'alovelace (Ada Lovelace)',
      arn: 'arn:aws:connect:ap-southeast-2:000000000000:instance/'
        + '54cb5f11-cbde-4029-8d4b-a8e2e3591f02/queue/agent/08cc85d2-8f7f-4107-b465-c2681f64c48d',
      resourceId: '08cc85d2-8f7f-4107-b465-c2681f64c48d',
    });
    expect(getParameter(result, 'Agent')).toEqual({
      name: 'Agent',
      value: 'arn:aws:connect:ap-southeast-2:000000000000:instance/'
        + '54cb5f11-cbde-4029-8d4b-a8e2e3591f02/agent/08cc85d2-8f7f-4107-b465-c2681f64c48d',
      resourceName: 'alovelace (Ada Lovelace)',
    });
  });

  it('sets a dynamic agent', () => {
    const result = new SetWorkingQueue({
      agentArn: dynamicValue.External('$.Attributes.Foo'),
    }).build();

    expect(result.metadata.useDynamic).toEqual(true);
    expect(result.metadata.queue).toEqual('$.Attributes.Foo');
    expect(getParameter(result, 'Agent')).toEqual({
      name: 'Agent',
      value: '$.Attributes.Foo',
      namespace: 'External',
    });
  });
});
