const AbstractNode = require('./AbstractNode');
const { isDynamicValue } = require('./dynamicValue');

module.exports = class AbstractSetWorkingQueue extends AbstractNode {
  /**
   * @param {string|DynamicValue} queueArn
   * @param {string} [displayName]
   * @returns {this}
   */
  setQueue(queueArn, displayName) {
    if (isDynamicValue(queueArn)) {
      this.metadata.useDynamic = true;
      this.metadata.queue = queueArn.value;
      return this.setParameter('Queue', queueArn);
    }

    this.metadata.useDynamic = false;
    this.metadata.queue = {
      id: queueArn,
      text: displayName,
    };
    return this.setParameter('Queue', {
      value: queueArn,
      resourceName: displayName,
    });
  }

  /**
   * @param {string|DynamicValue} agentArn
   * @param {string} [displayName]
   * @returns {this}
   */
  setAgent(agentArn, displayName) {
    if (isDynamicValue(agentArn)) {
      this.metadata.useDynamic = true;
      this.metadata.queue = agentArn.value;
      return this.setParameter('Agent', agentArn);
    }

    const arnParts = agentArn.split(':');
    const resourcePathParts = arnParts.pop().split('/');
    const [resourceRoot, connectInstanceId, agentPath, agentId] = resourcePathParts;
    arnParts.push([resourceRoot, connectInstanceId, 'queue', agentPath, agentId].join('/'));

    this.metadata.useDynamic = false;
    this.metadata.queue = {
      id: agentArn,
      text: displayName,
      resourceId: agentId,
      arn: arnParts.join(':'),
    };
    return this.setParameter('Agent', {
      value: agentArn,
      resourceName: displayName,
    });
  }
};
