import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { ddb } from '../dynamo.js'
import { BaseDynamoRepository } from './base-dynamodb-repository.js'
import { IFlightRepository, Flight } from '../../domain/model/flight.js'
import { fromISOToDate } from '../../../utils/date.js'

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

  protected override mapEntity(record: Record<string, unknown>): Flight {
    record.date = fromISOToDate(record.date as string)
    return record as Flight
  }

  protected override handleModel(entity: Flight): Flight {
    const model = entity as Record<string, unknown>
    const date = entity.date.toISOString()
    model.date = date
    model.gsi1pk = `${entity.from}#${entity.to}`
    model.gsi1sk = date
    return entity as Flight
  }
}
