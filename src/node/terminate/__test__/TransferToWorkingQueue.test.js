const { getBranch } = require('../../testutil');
const TransferToWorkingQueue = require('../TransferToWorkingQueue');

describe('TransferToWorkingQueue', () => {
  it('builds the basics', () => {
    const result = new TransferToWorkingQueue().build();
    expect(result.type).toEqual('Transfer');
    expect(result.target).toEqual('Queue');
    expect(result.metadata.useDynamic).toEqual(false);
  });

  it('sets the "At Capacity" branch', () => {
    const result = new TransferToWorkingQueue({
      atCapacityBranch: { id: 'at-capacity-id' },
    }).build();

    expect(getBranch(result, 'AtCapacity')).toEqual({
      condition: 'AtCapacity',
      transition: 'at-capacity-id',
    });
  });

  it('sets the "Error" branch', () => {
    const result = new TransferToWorkingQueue({
      errorBranch: { id: 'error-id' },
    }).build();

    expect(getBranch(result, 'Error')).toEqual({
      condition: 'Error',
      transition: 'error-id',
    });
  });
});
