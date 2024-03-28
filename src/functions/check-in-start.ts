import { NotificationService } from 'src/core/application/notification-service.js'

export const handler = async (event: unknown) => {
  console.log(`Check-in event: ${JSON.stringify(event)}`)

  const currentDate = new Date()
  const notificationService = new NotificationService()

  const result = await notificationService.startCheckIn(currentDate)

  console.log(`A total of ${result} message(s) where sent to start check-in process on the flight.`)
}
