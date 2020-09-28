const { UUID_REGEXP, getParameter, getBranch } = require('../../testutil');
const dynamicValue = require('../../dynamicValue');
const CheckContactAttributes = require('../CheckContactAttributes');

describe('CheckContactAttributes', () => {
  it('builds basics', () => {
    const result = new CheckContactAttributes().build();
    expect(result.id).toMatch(UUID_REGEXP);
    expect(result.type).toEqual('CheckAttribute');
    expect(result.branches).toEqual([]);
    expect(result.parameters).toEqual([]);
    expect(result.metadata.conditionMetadata).toEqual([]);
  });

  it('checks a System attribute', () => {
    const result = new CheckContactAttributes({
      checkValue: dynamicValue.System.CustomerNumber,
    }).build();
    expect(getParameter(result, 'Attribute')).toEqual({
      name: 'Attribute',
      value: 'Customer Number',
    });
    expect(getParameter(result, 'Namespace')).toEqual({
      name: 'Namespace',
      value: 'System',
    });
  });

  it('throws an exception when a non-dynamic value is specified', () => {
    expect(() => new CheckContactAttributes({ checkValue: 'just a string' }))
      .toThrowError('Validation error: checkValue must be a DynamicValue');
  });

  describe('branches', () => {
    it('builds a "No match" branch', () => {
      const result = new CheckContactAttributes({
        noMatchBranch: { id: 'no-match-transition' },
      }).build();

      expect(getBranch(result, 'NoMatch')).toEqual({
        condition: 'NoMatch',
        transition: 'no-match-transition',
      });
    });

    it('builds a "Equals" branch', () => {
      const terminateNode = { id: 'terminate-node' };
      const result = new CheckContactAttributes()
        .addEqualsBranch('equals-value', terminateNode)
        .build();

      expect(getBranch(result, 'Evaluate')).toEqual({
        condition: 'Evaluate',
        conditionType: 'Equals',
        conditionValue: 'equals-value',
        transition: 'terminate-node',
      });
      expect(result.metadata.conditionMetadata).toHaveLength(1);
      expect(result.metadata.conditionMetadata[0]).toEqual({
        id: expect.stringMatching(UUID_REGEXP),
        value: 'equals-value',
        operator: { name: 'Equals', value: 'Equals', shortDisplay: '=' },
      });
    });

    it('builds a "LessThan" branch', () => {
      const terminateNode = { id: 'terminate-node' };
      const result = new CheckContactAttributes()
        .addLessThanBranch(50, terminateNode)
        .build();

      expect(getBranch(result, 'Evaluate')).toEqual({
        condition: 'Evaluate',
        conditionType: 'LessThan',
        conditionValue: '50',
        transition: 'terminate-node',
      });
      expect(result.metadata.conditionMetadata).toHaveLength(1);
      expect(result.metadata.conditionMetadata[0]).toEqual({
        id: expect.stringMatching(UUID_REGEXP),
        value: '50',
        operator: { name: 'Is less than', value: 'LessThan', shortDisplay: '<' },
      });
    });

    it('builds a "LessThanOrEqualTo" branch', () => {
      const terminateNode = { id: 'terminate-node' };
      const result = new CheckContactAttributes()
        .addLessThanOrEqualToBranch(90, terminateNode)
        .build();

      expect(getBranch(result, 'Evaluate')).toEqual({
        condition: 'Evaluate',
        conditionType: 'LessThanOrEqualTo',
        conditionValue: '90',
        transition: 'terminate-node',
      });
      expect(result.metadata.conditionMetadata).toHaveLength(1);
      expect(result.metadata.conditionMetadata[0]).toEqual({
        id: expect.stringMatching(UUID_REGEXP),
        value: '90',
        operator: { name: 'Is less or equal', value: 'LessThanOrEqualTo', shortDisplay: '<=' },
      });
    });

    it('builds a "GreaterThan" branch', () => {
      const terminateNode = { id: 'terminate-node' };
      const result = new CheckContactAttributes()
        .addGreaterThanBranch(9000, terminateNode)
        .build();

      expect(getBranch(result, 'Evaluate')).toEqual({
        condition: 'Evaluate',
        conditionType: 'GreaterThan',
        conditionValue: '9000',
        transition: 'terminate-node',
      });
      expect(result.metadata.conditionMetadata).toHaveLength(1);
      expect(result.metadata.conditionMetadata[0]).toEqual({
        id: expect.stringMatching(UUID_REGEXP),
        value: '9000',
        operator: { name: 'Is greater than', value: 'GreaterThan', shortDisplay: '>' },
      });
    });

    it('builds a "GreaterThanOrEqualTo" branch', () => {
      const terminateNode = { id: 'terminate-node' };
      const result = new CheckContactAttributes()
        .addGreaterThanOrEqualToBranch(9000, terminateNode)
        .build();

      expect(getBranch(result, 'Evaluate')).toEqual({
        condition: 'Evaluate',
        conditionType: 'GreaterThanOrEqualTo',
        conditionValue: '9000',
        transition: 'terminate-node',
      });
      expect(result.metadata.conditionMetadata).toHaveLength(1);
      expect(result.metadata.conditionMetadata[0]).toEqual({
        id: expect.stringMatching(UUID_REGEXP),
        value: '9000',
        operator: { name: 'Is greater or equal', value: 'GreaterThanOrEqualTo', shortDisplay: '>=' },
      });
    });

    it('builds a "StartsWith" branch', () => {
      const terminateNode = { id: 'terminate-node' };
      const result = new CheckContactAttributes()
        .addStartsWithBranch('alpha-', terminateNode)
        .build();

      expect(getBranch(result, 'Evaluate')).toEqual({
        condition: 'Evaluate',
        conditionType: 'StartsWith',
        conditionValue: 'alpha-',
        transition: 'terminate-node',
      });
      expect(result.metadata.conditionMetadata).toHaveLength(1);
      expect(result.metadata.conditionMetadata[0]).toEqual({
        id: expect.stringMatching(UUID_REGEXP),
        value: 'alpha-',
        operator: { name: 'Starts with', value: 'StartsWith', shortDisplay: 'starts with' },
      });
    });

    it('builds a "EndsWith" branch', () => {
      const terminateNode = { id: 'terminate-node' };
      const result = new CheckContactAttributes()
        .addEndsWithBranch('-omega', terminateNode)
        .build();

      expect(getBranch(result, 'Evaluate')).toEqual({
        condition: 'Evaluate',
        conditionType: 'EndsWith',
        conditionValue: '-omega',
        transition: 'terminate-node',
      });
      expect(result.metadata.conditionMetadata).toHaveLength(1);
      expect(result.metadata.conditionMetadata[0]).toEqual({
        id: expect.stringMatching(UUID_REGEXP),
        value: '-omega',
        operator: { name: 'Ends with', value: 'EndsWith', shortDisplay: 'ends with' },
      });
    });

    it('builds a "Contains" branch', () => {
      const terminateNode = { id: 'terminate-node' };
      const result = new CheckContactAttributes()
        .addContainsBranch('-lima-', terminateNode)
        .build();

      expect(getBranch(result, 'Evaluate')).toEqual({
        condition: 'Evaluate',
        conditionType: 'Contains',
        conditionValue: '-lima-',
        transition: 'terminate-node',
      });
      expect(result.metadata.conditionMetadata).toHaveLength(1);
      expect(result.metadata.conditionMetadata[0]).toEqual({
        id: expect.stringMatching(UUID_REGEXP),
        value: '-lima-',
        operator: { name: 'Contains', value: 'Contains', shortDisplay: 'contains' },
      });
    });
  });
});
