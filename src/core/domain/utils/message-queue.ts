import { CheckInFlightMessage, CheckInPassengerMessage } from '../messages/index.js'

export interface MessageQueue {
  sendMessage(queueUrl: string, message: string): Promise<boolean>

  sendCheckInFlightMessage(message: CheckInFlightMessage): Promise<boolean>

  sendCheckInPassengerMessage(message: CheckInPassengerMessage): Promise<boolean>
}
