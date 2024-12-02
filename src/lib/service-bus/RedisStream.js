/**
 *
 */
export class RedisStream {
  /**
   * Constructs an instance of RedisStream.
   * @param {string} streamName - The name of the Redis stream.
   * @param {object} connector - The connector instance to interact with the Redis stream.
   */
  constructor(streamName, connector) {
    this.streamName = streamName;
    this.connector = connector;
  }

  /**
   * Sends a message to the Redis stream.
   * @param {object} message - The message object to send, where each key-value pair                        represents a field in the stream entry.
   * @returns {Promise<void>} A promise that resolves once the message is added to the stream.
   */
  async sendMessage(message) {
    await this.connector.xadd(this.streamName, '*', ...Object.entries(message).flat());
  }
}
