export const handler = async (event: unknown) => {
  // get the message { flightId }
  // get all the passengers of the flight
  // for each passenger, push a message into the sqs { flightId, passengerId }
  // update the flight status

  console.log(`Check-in Flight Notifier event: ${JSON.stringify(event)}`)
}
