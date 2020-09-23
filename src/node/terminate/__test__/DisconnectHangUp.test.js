const { UUID_REGEXP } = require('../../testutil');
const DisconnectHangUp = require('../DisconnectHangUp');

describe('DisconnectHangUp', () => {
  it('creates a basic disconnect node', () => {
    const result = new DisconnectHangUp().build();
    expect(result.id).toMatch(UUID_REGEXP);
    expect(result.type).toEqual('Disconnect');
    expect(result.branches).toEqual([]);
    expect(result.parameters).toEqual([]);
  });
});
