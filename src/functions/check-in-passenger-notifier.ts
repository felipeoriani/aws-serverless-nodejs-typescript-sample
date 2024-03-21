export const handler = async (event: unknown) => {
  // get the message { flightId, passengerId }
  // get the flight and passenger data
  // send an email to sat that the checkin is open
  console.log(`Check-in Passenger Notifier event: ${JSON.stringify(event)}`)
}
