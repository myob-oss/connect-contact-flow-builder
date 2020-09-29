const CountryDialCode = require('../CountryDialCode');
const AbstractStoreCustomerInput = require('./AbstractStoreCustomerInput');

/**
 * @typedef {AbstractStoreCustomerInputOptions} StoreCustomerInputPhoneOptions
 * @property {CountryDialCode} [localCountryCode]
 * @property {AbstractNode} [invalidNumberBranch]
 */

module.exports = class StoreCustomerInputPhone extends AbstractStoreCustomerInput {
  /**
   * @param {StoreCustomerInputPhoneOptions} [options]
   */
  constructor(options = {}) {
    super(options);
    this.metadata.countryCodePrefix = CountryDialCode.US.dialCode;
    this.setInvalidNumberBranch(options.invalidNumberBranch || null);
    this.setParameter('CustomerInputType', 'PhoneNumber');
    if (options.localCountryCode) {
      this.setLocalCountryCode(options.localCountryCode);
    } else {
      this.setParameter('PhoneNumberFormat', 'International');
    }
  }

  /**
   * @param {AbstractNode} node
   * @returns {this}
   */
  setInvalidNumberBranch(node) {
    return this.setBranch('InvalidNumber', node);
  }

  /**
   * @param {CountryDialCode} countryCode
   * @returns {this}
   */
  setLocalCountryCode(countryCode) {
    this.metadata.countryCodePrefix = countryCode.dialCode;
    return this
      .setParameter('PhoneNumberFormat', 'Local')
      .setParameter('CountryCode', countryCode.countryAcronym);
  }
};
