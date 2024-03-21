export const handler = async (event: unknown) => {
  // get all the flights ready to be checkin
  // for each flight, push a message into sqs with { flightId }

  console.log(`Check-in event: ${JSON.stringify(event)}`)
}
