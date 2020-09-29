// const { getBranch } = require('../../testutil');
const TransferToQueue = require('../TransferToQueue');

describe('TransferToQueue', () => {
  it('builds the basics', () => {
    const result = new TransferToQueue().build();
    expect(result.metadata.useDynamic).toEqual(false);
  });
});
