import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { ddb } from '../dynamo.js'
import { BaseDynamoRepository } from './base-dynamodb-repository.js'
import { IFlightRepository, Flight } from '../../domain/model/flight.js'

/**
 * Implementation for IFlightRepository using DynamoDB as the data source.
 * @param ddbDocumentClient Instance for DynamoDBDocumentClient.
 * @returns An instance of the derived repository class to handle Task entity.
 * @see BaseDynamoRepository
 * @see IFlightRepository
 * @see Flight
 */
export class FlightRepository extends BaseDynamoRepository<Flight> implements IFlightRepository {
  constructor(ddbDocumentClient: DynamoDBDocumentClient = ddb) {
    super(ddbDocumentClient, 'flight')
  }
}