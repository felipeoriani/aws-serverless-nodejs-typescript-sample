import { SQSEvent } from 'aws-lambda'
import { CheckInFlightMessage } from '../core/domain/messages/index.js'
import { NotificationService } from 'src/core/application/notification-service.js'

export const handler = async (event: SQSEvent) => {
  console.log(`Check-in Flight event: ${JSON.stringify(event)}`)

  const message = JSON.parse(event.Records[0].body) as CheckInFlightMessage

  const notificationService = new NotificationService()

  const result = await notificationService.checkInFlight(message.flightId)

  console.log(
    `A total of ${result} message(s) where sent to start check-in process of the passengers of the flight id: ${message.flightId}.`
  )
}
