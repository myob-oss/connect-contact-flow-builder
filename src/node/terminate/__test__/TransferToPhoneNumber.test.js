const { getBranch, getParameter } = require('../../testutil');
const dynamicValue = require('../../dynamicValue');
const CountryDialCode = require('../../CountryDialCode');
const TransferToPhoneNumber = require('../TransferToPhoneNumber');

describe('TransferToPhoneNumber', () => {
  it('builds the basics', () => {
    const result = new TransferToPhoneNumber().build();
    expect(result.type).toEqual('Transfer');
    expect(result.target).toEqual('PhoneNumber');
    expect(getParameter(result, 'TimeLimit')).toEqual({
      name: 'TimeLimit',
      value: '30',
    });
    expect(getParameter(result, 'BlindTransfer')).toEqual({
      name: 'BlindTransfer',
      value: false,
    });
  });

  it('transfers to a static phone number', () => {
    const result = new TransferToPhoneNumber({
      localCountryCode: CountryDialCode.AU,
      phoneNumber: '+61400800900',
    }).build();

    expect(result.metadata.CountryCode).toEqual('au');
    expect(getParameter(result, 'PhoneNumber')).toEqual({
      name: 'PhoneNumber',
      value: '+61400800900',
    });
  });

  it('transfers to a dynamic phone number', () => {
    const result = new TransferToPhoneNumber({
      phoneNumber: dynamicValue.External('TransferNumber'),
    }).build();

    expect(getParameter(result, 'PhoneNumber')).toEqual({
      name: 'PhoneNumber',
      value: 'TransferNumber',
      namespace: 'External',
    });
  });

  it('specifies a static timeout', () => {
    const result = new TransferToPhoneNumber({
      timeout: 0,
    }).build();

    expect(getParameter(result, 'TimeLimit')).toEqual({
      name: 'TimeLimit',
      value: '0',
    });
  });

  it('specifies a dynamic timeout', () => {
    const result = new TransferToPhoneNumber({
      timeout: dynamicValue.External('TransferTimeout'),
    }).build();

    expect(getParameter(result, 'TimeLimit')).toEqual({
      name: 'TimeLimit',
      value: 'TransferTimeout',
      namespace: 'External',
    });
  });

  it('does a blind transfer', () => {
    const result = new TransferToPhoneNumber({
      resumeAfterDisconnect: false,
      timeoutBranch: { id: 'timeout-id' },
      successBranch: { id: 'success-id' },
      callFailedBranch: { id: 'call-failed-id' },
      errorBranch: { id: 'error-id' },
    }).build();

    expect(getParameter(result, 'BlindTransfer')).toEqual({
      name: 'BlindTransfer',
      value: true,
    });
    expect(getBranch(result, 'Error')).toEqual({
      condition: 'Error',
      transition: 'error-id',
    });
    expect(getBranch(result, 'Success')).toBeUndefined();
    expect(getBranch(result, 'CallFailure')).toBeUndefined();
    expect(getBranch(result, 'Timeout')).toBeUndefined();
  });

  describe('branches', () => {
    it('sets the "Success" branch', () => {
      const result = new TransferToPhoneNumber({
        successBranch: { id: 'success-branch-id' },
      }).build();
      expect(getBranch(result, 'Success')).toEqual({
        condition: 'Success',
        transition: 'success-branch-id',
      });
    });

    it('sets the "CallFailure" branch', () => {
      const result = new TransferToPhoneNumber({
        callFailedBranch: { id: 'call-failure-branch-id' },
      }).build();
      expect(getBranch(result, 'CallFailure')).toEqual({
        condition: 'CallFailure',
        transition: 'call-failure-branch-id',
      });
    });

    it('sets the "Timeout" branch', () => {
      const result = new TransferToPhoneNumber({
        timeoutBranch: { id: 'timeout-branch-id' },
      }).build();
      expect(getBranch(result, 'Timeout')).toEqual({
        condition: 'Timeout',
        transition: 'timeout-branch-id',
      });
    });

    it('sets the "Error" branch', () => {
      const result = new TransferToPhoneNumber({
        errorBranch: { id: 'error-branch-id' },
      }).build();
      expect(getBranch(result, 'Error')).toEqual({
        condition: 'Error',
        transition: 'error-branch-id',
      });
    });
  });
});
