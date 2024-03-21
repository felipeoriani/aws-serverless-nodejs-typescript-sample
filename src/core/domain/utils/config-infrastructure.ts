export enum EnvironmentVariable {
  checkInFlightQueueUrl = 'CHECK_IN_FLIGHT_SQS_QUEUE_URL',
  checkInPassengerQueueUrl = 'CHECK_IN_PASSENGER_SQS_QUEUE_URL',
}

export interface ConfigInfrastructure {
  getEnvironmentVariable(name: EnvironmentVariable): string
}
