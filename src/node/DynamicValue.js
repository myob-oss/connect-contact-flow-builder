/**
 * @typedef DynamicValue
 * @property {string} namespace
 * @property {string} value
 */

/**
 * @enum {DynamicValue}
 */
module.exports.System = {
  CustomerNumber: { namespace: 'System', value: 'Customer Number' },
  DialedNumber: { namespace: 'System', value: 'Dialed Number' },
  CustomerCallbackNumber: { namespace: 'System', value: 'Customer callback number' },
  StoredCustomerInput: { namespace: 'System', value: 'Stored customer input' },
  QueueName: { namespace: 'System', value: 'Queue.Name' },
  QueueARN: { namespace: 'System', value: 'Queue.ARN' },
  QueueOutboundNumber: { namespace: 'System', value: 'Queue.OutboundCallerId.Address' },
  TextToSpeechVoice: { namespace: 'System', value: 'TextToSpeechVoiceId' },
  ContactId: { namespace: 'System', value: 'ContactId' },
  InitialContactId: { namespace: 'System', value: 'InitialContactId' },
  PreviousContactId: { namespace: 'System', value: 'PreviousContactId' },
  Channel: { namespace: 'System', value: 'Channel' },
  InstanceARN: { namespace: 'System', value: 'InstanceARN' },
  InitiationMethod: { namespace: 'System', value: 'InitiationMethod' },
  LexIntent: { namespace: 'System', value: 'Lex.IntentName' },
};

/**
 * @enum {DynamicValue}
 */
module.exports.Agent = {
  UserName: { namespace: 'Agent', value: 'Agent.UserName' },
  FirstName: { namespace: 'Agent', value: 'Agent.FirstName' },
  LastName: { namespace: 'Agent', value: 'Agent.LastName' },
  ARN: { namespace: 'Agent', value: 'Agent.ARN' },
};

/**
 * @enum {DynamicValue}
 */
module.exports.QueueMetrics = {
  QueueName: { namespace: 'QueueMetrics', value: 'Metrics.Queue.Name' },
  QueueARN: { namespace: 'QueueMetrics', value: 'Metrics.Queue.ARN' },
  ContactsInQueue: { namespace: 'QueueMetrics', value: 'Metrics.Queue.Size' },
  OldestContactInQueue: { namespace: 'QueueMetrics', value: 'Metrics.Queue.OldestContactAge' },
  AgentsOnline: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Online.Count' },
  AgentsAvailable: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Available.Count' },
  AgentsStaffed: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Staffed.Count' },
  AgentsAfterContactWork: { namespace: 'QueueMetrics', value: 'Metrics.Agents.AfterContactWork.Count' },
  AgentsBusy: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Busy.Count' },
  AgentsMissed: { namespace: 'QueueMetrics', value: 'Metrics.Agents.Missed.Count' },
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

/**
 * @enum {DynamicValue}
 */
module.exports.MediaStreams = {
  CustomerAudioStreamARN: { namespace: 'MediaStreams', value: 'MediaStreams.Customer.Audio.StreamARN' },
  CustomerAudioStartTimestamp: { namespace: 'MediaStreams', value: 'MediaStreams.Customer.Audio.StartTimestamp' },
  CustomerAudioStopTimestamp: { namespace: 'MediaStreams', value: 'MediaStreams.Customer.Audio.StopTimestamp' },
  CustomerAudioStartFragmentNumber: { namespace: 'MediaStreams', value: 'MediaStreams.Customer.Audio.StartFragmentNumber' },
};
