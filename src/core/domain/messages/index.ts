export type CheckInFlightMessage = {
  flightId: string
}

export type CheckInPassengerMessage = {
  flight: string
  passengerId: string
}
