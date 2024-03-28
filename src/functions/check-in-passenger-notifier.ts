import { SQSEvent } from 'aws-lambda'
import { CheckInPassengerMessage } from '../core/domain/messages/index.js'
import { NotificationService } from 'src/core/application/notification-service.js'

export const handler = async (event: SQSEvent) => {
  console.log(`Check-in  Passenger event: ${JSON.stringify(event)}`)

  const message = JSON.parse(event.Records[0].body) as CheckInPassengerMessage

  const notificationService = new NotificationService()

  const result = await notificationService.checkInPassenger(message.flightId, message.passengerId)

  if (result) {
    console.log(`The passenger ${message.passengerId} was notified for the flight ${message.flightId}.`)
  }
}
