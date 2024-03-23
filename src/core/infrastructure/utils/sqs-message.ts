import { SQSClient, SendMessageCommand } from '@aws-sdk/client-sqs'
import { CheckInFlightMessage, CheckInPassengerMessage } from '../../../core/domain/messages/index.js'
import { ConfigInfrastructure, EnvironmentVariable } from '../../../core/domain/utils/config-infrastructure.js'
import { MessageQueue } from '../../../core/domain/utils/message-queue.js'
import { Config } from './config.js'

export class SqsMessage implements MessageQueue {
  private readonly sqlClient: SQSClient

  constructor(private readonly config: ConfigInfrastructure = new Config()) {
    this.sqlClient = new SQSClient({})
  }

  public async sendCheckInFlightMessage(message: CheckInFlightMessage): Promise<boolean> {
    const queueUrl = this.config.getEnvironmentVariable(EnvironmentVariable.checkInFlightQueueUrl)
    return this.sendMessage(queueUrl, JSON.stringify(message))
  }

  public async sendCheckInPassengerMessage(message: CheckInPassengerMessage): Promise<boolean> {
    const queueUrl = this.config.getEnvironmentVariable(EnvironmentVariable.checkInPassengerQueueUrl)
    return this.sendMessage(queueUrl, JSON.stringify(message))
  }

  public async sendMessage(queueUrl: string, message: string): Promise<boolean> {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: message,
    })
    const res = await this.sqlClient.send(command)
    return res.$metadata.httpStatusCode === 200
  }
}
