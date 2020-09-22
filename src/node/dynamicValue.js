/**
 * @typedef DynamicValue
 * @property {string} namespace
 * @property {string} value
 */

/**
 * @param {*} value
 * @returns {boolean}
 */
module.exports.isDynamicValue = value => !!value
  && value.value !== undefined
  && value.namespace !== undefined;

module.exports.System = {
  /**
   * @type {DynamicValue}
   */
  CustomerNumber: { namespace: 'System', value: 'Customer Number' },
  /**
   * @type {DynamicValue}
   */
  DialedNumber: { namespace: 'System', value: 'Dialed Number' },
  /**
   * @type {DynamicValue}
   */
  CustomerCallbackNumber: { namespace: 'System', value: 'Customer callback number' },
  /**
   * @type {DynamicValue}
   */
  StoredCustomerInput: { namespace: 'System', value: 'Stored customer input' },
  /**
   * @type {DynamicValue}
   */
  QueueName: { namespace: 'System', value: 'Queue.Name' },
  /**
   * @type {DynamicValue}
   */
  QueueARN: { namespace: 'System', value: 'Queue.ARN' },
  /**
   * @type {DynamicValue}
   */
  QueueOutboundNumber: { namespace: 'System', value: 'Queue.OutboundCallerId.Address' },
  /**
   * @type {DynamicValue}
   */
  TextToSpeechVoice: { namespace: 'System', value: 'TextToSpeechVoiceId' },
  /**
   * @type {DynamicValue}
   */
  ContactId: { namespace: 'System', value: 'ContactId' },
  /**
   * @type {DynamicValue}
   */
  InitialContactId: { namespace: 'System', value: 'InitialContactId' },
  /**
   * @type {DynamicValue}
   */
  PreviousContactId: { namespace: 'System', value: 'PreviousContactId' },
  /**
   * @type {DynamicValue}
   */
  Channel: { namespace: 'System', value: 'Channel' },
  /**
   * @type {DynamicValue}
   */
  InstanceARN: { namespace: 'System', value: 'InstanceARN' },
  /**
   * @type {DynamicValue}
   */
  InitiationMethod: { namespace: 'System', value: 'InitiationMethod' },
  /**
   * @type {DynamicValue}
   */
  LexIntent: { namespace: 'System', value: 'Lex.IntentName' },
};

module.exports.Agent = {
  /**
   * @type {DynamicValue}
   */
  UserName: { namespace: 'Agent', value: 'Agent.UserName' },
  /**
   * @type {DynamicValue}
   */
  FirstName: { namespace: 'Agent', value: 'Agent.FirstName' },
  /**
   * @type {DynamicValue}
   */
  LastName: { namespace: 'Agent', value: 'Agent.LastName' },
  /**
   * @type {DynamicValue}
   */
  ARN: { namespace: 'Agent', value: 'Agent.ARN' },
};

module.exports.QueueMetrics = {
  /**
   * @type {DynamicValue}
   */
  QueueName: { namespace: 'QueueMetrics', value: 'Metrics.Queue.Name' },
  /**
   * @type {DynamicValue}
   */
  QueueARN: { namespace: 'QueueMetrics', value: 'Metrics.Queue.ARN' },
  /**
   * @type {DynamicValue}
   */
  ContactsInQueue: { namespace: 'QueueMetrics', value: 'Metrics.Queue.Size' },
  /**
   * @type {DynamicValue}
   */
  OldestContactInQueue: { namespace: 'QueueMetrics', value: 'Metrics.Queue.OldestContactAge' },
  /**
   * @type {DynamicValue}
   */
  AgentsOnline: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Online.Count' },
  /**
   * @type {DynamicValue}
   */
  AgentsAvailable: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Available.Count' },
  /**
   * @type {DynamicValue}
   */
  AgentsStaffed: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Staffed.Count' },
  /**
   * @type {DynamicValue}
   */
  AgentsAfterContactWork: { namespace: 'QueueMetrics', value: 'Metrics.Agents.AfterContactWork.Count' },
  /**
   * @type {DynamicValue}
   */
  AgentsBusy: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Busy.Count' },
  /**
   * @type {DynamicValue}
   */
  AgentsMissed: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Missed.Count' },
  /**
   * @type {DynamicValue}
   */
  AgentsNonProductive: { namespace: 'QueueMetrics', value: 'Metrics.Agents.NonProductive.Count' },
};

/**
 * @param {string} value
 * @returns {DynamicValue}
 */
module.exports.UserDefined = value => ({ namespace: 'User Defined', value });

/**
 * @param {string} value
 * @returns {DynamicValue}
 */
module.exports.External = value => ({ namespace: 'External', value });

/**
 * @param {string} value
 * @returns {DynamicValue}
 */
module.exports.LexSlots = value => ({ namespace: 'Lex.Slots', value });

/**
 * @param {string} value
 * @returns {DynamicValue}
 */
module.exports.LexSessionAttributes = value => ({ namespace: 'Lex.SessionAttributes', value });

module.exports.MediaStreams = {
  /**
   * @type {DynamicValue}
   */
  CustomerAudioStreamARN: { namespace: 'MediaStreams', value: 'MediaStreams.Customer.Audio.StreamARN' },
  /**
   * @type {DynamicValue}
   */
  CustomerAudioStartTimestamp: { namespace: 'MediaStreams', value: 'MediaStreams.Customer.Audio.StartTimestamp' },
  /**
   * @type {DynamicValue}
   */
  CustomerAudioStopTimestamp: { namespace: 'MediaStreams', value: 'MediaStreams.Customer.Audio.StopTimestamp' },
  /**
   * @type {DynamicValue}
   */
  CustomerAudioStartFragmentNumber: { namespace: 'MediaStreams', value: 'MediaStreams.Customer.Audio.StartFragmentNumber' },
};
