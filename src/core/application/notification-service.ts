import { FlightState, IFlightRepository } from '../domain/model/flight.js'
import { MessageQueue } from '../domain/utils/message-queue.js'
import { FlightRepository } from '../infrastructure/repositories/flight-repository.js'
import { SqsMessage } from '../infrastructure/utils/sqs-message.js'

export class NotificationService {
  constructor(
    private readonly flightRepository: IFlightRepository = new FlightRepository(),
    private readonly messageQueue: MessageQueue = new SqsMessage()
  ) {}

  async startCheckIn(startDate: Date): Promise<number> {
    // get all the flights ready to be checkin
    const flights = await this.flightRepository.getFlightsToCheckIn(startDate)

    // prepare all the messages to be sent
    const messages = flights.map((flight) => this.messageQueue.sendCheckInFlightMessage({ flightId: flight.id }))

    // push all the messages in parallel to the SQS instance
    const results = await Promise.all(messages)

    // return the number of requests that succeed
    return results.filter((x) => x).length
  }

  async checkInFlight(flightId: string): Promise<number> {
    // get all the passengers of the flight

    const flight = await this.flightRepository.get(flightId)

    if (!flight) {
      console.log(`The flight with id ${flightId} is not available.`)
      return 0
    }

    // TODO: get all the passengers of the flightId
    // TODO: for each passenger, push a message into the sqs { flightId, passengerId }

    // update the flight status
    flight.state = FlightState.CheckIn
    await this.flightRepository.update(flightId, flight)

    // return the number of succeed messages
    return 0
  }

  async checkInPassenger(flightId: string, passengerId: string): Promise<boolean> {
    // get the passenger seat to notify of the check-in process

    console.log(`Flight: ${flightId}, Passenger: ${passengerId}`)

    // send email using AWS SES with check-in details

    return true
  }
}
