const CountryDialCode = require('../../CountryDialCode');
const { getParameter, getBranch } = require('../../testutil');
const StoreCustomerInputPhone = require('../StoreCustomerInputPhone');

describe('StoreCustomerInputPhone', () => {
  it('builds the basics', () => {
    const result = new StoreCustomerInputPhone().build();
    expect(result.type).toBe('StoreUserInput');
    expect(result.metadata.useDynamic).toBe(false);
    expect(result.metadata.useDynamicForEncryptionKeys).toBe(true);
    expect(result.metadata.useDynamicForTerminatorDigits).toBe(false);
    expect(result.metadata.countryCodePrefix).toBe(CountryDialCode.US.dialCode);
    expect(getParameter(result, 'Timeout')).toEqual({
      name: 'Timeout',
      value: '5',
    });
  });

  it('sets an error branch', () => {
    const blue = new StoreCustomerInputPhone({ text: 'This is where we start' });
    const green = new StoreCustomerInputPhone({
      promptText: 'This is where we end',
      errorBranch: blue,
    });
    blue.setErrorBranch(green);

    expect(getBranch(blue.build(), 'Error')).toEqual({
      condition: 'Error',
      transition: green.id,
    });

    expect(getBranch(green.build(), 'Error')).toEqual({
      condition: 'Error',
      transition: blue.id,
    });
  });

  it('sets the invalid number branch', () => {
    const result = new StoreCustomerInputPhone({
      invalidNumberBranch: { id: 'invalid-number' },
    }).build();
    expect(getBranch(result, 'InvalidNumber')).toEqual({
      condition: 'InvalidNumber',
      transition: 'invalid-number',
    });
  });

  it('takes local format', () => {
    const result = new StoreCustomerInputPhone({
      localCountryCode: CountryDialCode.AU,
      firstEntryTimeLimit: 8,
    }).build();

    expect(result.metadata.countryCodePrefix).toEqual(CountryDialCode.AU.dialCode);
    expect(getParameter(result, 'CustomerInputType')).toEqual({
      name: 'CustomerInputType',
      value: 'PhoneNumber',
    });
    expect(getParameter(result, 'PhoneNumberFormat')).toEqual({
      name: 'PhoneNumberFormat',
      value: 'Local',
    });
    expect(getParameter(result, 'CountryCode')).toEqual({
      name: 'CountryCode',
      value: CountryDialCode.AU.countryAcronym,
    });
    expect(getParameter(result, 'Timeout')).toEqual({
      name: 'Timeout',
      value: '8',
    });
  });

  it('takes international format', () => {
    const result = new StoreCustomerInputPhone({
      firstEntryTimeLimit: 9,
    }).build();

    expect(getParameter(result, 'CustomerInputType')).toEqual({
      name: 'CustomerInputType',
      value: 'PhoneNumber',
    });
    expect(getParameter(result, 'PhoneNumberFormat')).toEqual({
      name: 'PhoneNumberFormat',
      value: 'International',
    });
    expect(getParameter(result, 'Timeout')).toEqual({
      name: 'Timeout',
      value: '9',
    });
  });
});
